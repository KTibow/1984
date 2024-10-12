import type { RequestHandler } from "@sveltejs/kit";
import { json, error } from "@sveltejs/kit";
import { GROQ_KEY } from "$env/static/private";

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get("q");
  if (!query) {
    error(400, "No query provided");
  }

  const word = query.replace("define ", "");

  const wiktionaryResponse = await fetch(
    `https://simple.wiktionary.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=${word}`,
  );
  const wiktionaryData: { query: { pages: Record<string, { revisions?: [{ "*": string }] }> } } =
    await wiktionaryResponse.json();

  const page = Object.values(wiktionaryData.query.pages)[0];
  if (!page.revisions) {
    error(404, "Word not found");
  }
  const content = page.revisions[0]["*"];

  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `<attachment>${content}</attachment>\nDefine ${word} in one sentence using only simple, common language.`,
        },
      ],
      model: "llama-3.2-3b-preview",
      temperature: 0,
    }),
  });
  const groqData = await groqResponse.json();

  const definition = groqData.choices[0].message.content.trim();

  return json({ definition });
};
