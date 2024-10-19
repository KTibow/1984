export type MathResult = {
  result: number | string;
  unit?: string;
};

type Token = number | string;

export function handleMathSearch(query: string): MathResult | null {
  query = query.trim();

  // Unit conversion
  const unitConversionRegex = /^([\d.]+)\s*(km|m|kg|g|lb|oz)\s+to\s+(km|m|kg|g|lb|oz)$/i;
  const unitMatch = query.match(unitConversionRegex);
  if (unitMatch) {
    const [, value, fromUnit, toUnit] = unitMatch;
    const conversionResult = convertUnits(
      parseFloat(value),
      fromUnit.toLowerCase(),
      toUnit.toLowerCase(),
    );
    if (conversionResult !== null) {
      return { result: conversionResult, unit: toUnit };
    }
  }

  // Basic arithmetic
  if (isValidMathExpression(query)) {
    try {
      const result = evaluateExpression(query);
      if (result !== null) {
        return { result: result.toString() };
      }
    } catch (error) {
      // Invalid math expression
    }
  }

  return null;
}

function isValidMathExpression(expression: string): boolean {
  const validTokens = /^[\d\s+\-*/^().,]+$/;
  return validTokens.test(expression);
}

function convertUnits(value: number, fromUnit: string, toUnit: string): number | null {
  const conversions: { [key: string]: number } = {
    kmtom: 1000,
    mtokmn: 0.001,
    kgtog: 1000,
    gtokg: 0.001,
    lbtooz: 16,
    oztolb: 0.0625,
  };

  const conversionKey = `${fromUnit}to${toUnit}`;
  const conversionFactor = conversions[conversionKey];

  if (conversionFactor) {
    return value * conversionFactor;
  }

  return null;
}

function evaluateExpression(expression: string): number | null {
  const tokens = tokenizeExpression(expression);
  return evaluateTokens(tokens);
}

function tokenizeExpression(expression: string): Token[] {
  const regex = /(\d*\.?\d+|[+\-*/^()]|\/)/g;
  const tokens = expression.match(regex) || [];

  const result: Token[] = [];
  let i = 0;

  while (i < tokens.length) {
    if (
      tokens[i] === "-" &&
      (i === 0 ||
        tokens[i - 1] === "(" ||
        tokens[i - 1] === "+" ||
        tokens[i - 1] === "-" ||
        tokens[i - 1] === "*" ||
        tokens[i - 1] === "/" ||
        tokens[i - 1] === "^")
    ) {
      // Combine the '-' with the next number to form a negative number
      const negativeNumber = tokens[i] + tokens[i + 1];
      result.push(parseFloat(negativeNumber));
      i += 2; // Skip the next token since it's part of the negative number
    } else {
      const token = tokens[i];
      const num = parseFloat(token);
      result.push(isNaN(num) ? token : num);
      i++;
    }
  }

  return result;
}

function evaluateTokens(tokens: Token[]): number {
  const output: Token[] = [];
  const operators: string[] = [];
  const precedence: { [key: string]: number } = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };

  for (const token of tokens) {
    if (typeof token === "number") {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop()!);
      }
      operators.pop(); // Remove '('
    } else {
      while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    output.push(operators.pop()!);
  }

  const stack: number[] = [];
  for (const token of output) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
      }
    }
  }

  return stack[0];
}
