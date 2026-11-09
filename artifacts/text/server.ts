import { smoothStream, streamText } from "ai";
import { updateDocumentPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocumentHandler } from "@/lib/artifacts/server";

export const textDocumentHandler = createDocumentHandler<"text">({
  kind: "text",
  onCreateDocument: async ({ title, dataStream, modelId }) => {
    let draftContent = "";

    const { fullStream } = streamText({
      experimental_transform: smoothStream({ chunking: "word" }),
      model: getLanguageModel(modelId),
      prompt: title,
      system:
        "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.text;
        dataStream.write({
          data: delta.text,
          transient: true,
          type: "data-textDelta",
        });
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream, modelId }) => {
    let draftContent = "";

    const { fullStream } = streamText({
      experimental_transform: smoothStream({ chunking: "word" }),
      model: getLanguageModel(modelId),
      prompt: description,
      system: updateDocumentPrompt(document.content, "text"),
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.text;
        dataStream.write({
          data: delta.text,
          transient: true,
          type: "data-textDelta",
        });
      }
    }

    return draftContent;
  },
});
