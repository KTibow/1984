import { build, context } from "esbuild";

// Common configuration
const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  external: ["@azure/functions-core"],
  outfile: "build/index.js",
  banner: {
    js: `import { createRequire } from "module"; const require = createRequire(import.meta.url);`,
  },
};

// Build or watch based on passed argument
const isWatch = process.argv.includes("--watch");

if (isWatch) {
  const ctx = await context(baseConfig);
  await ctx.watch();
  console.log("Watching...");
} else {
  await build(baseConfig);
  console.log("Build complete");
}
