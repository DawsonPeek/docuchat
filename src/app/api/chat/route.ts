import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pinecone } from "@/lib/pinecone";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { message, fileName } = await req.json();

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "text-embedding-004",
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: fileName,
    });

    const retriever = vectorStore.asRetriever({ k: 3 });

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0,
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
      Rispondi alla domanda dell'utente basandoti SOLO sul contesto seguente.
      Se la risposta non è nel contesto, rispondi con "Non lo so basandomi su questo documento".
      
      Contesto:
      {context}
      
      Domanda: {input}
    `);

    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });
    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });

    const response = await retrievalChain.invoke({ input: message });

    const pages = response.context.map((doc: any) => {
      const pageNumber = doc.metadata["loc.pageNumber"];
      return pageNumber !== undefined ? pageNumber + 1 : null;
    }).filter((page: number | null) => page !== null);

    const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

    return NextResponse.json({
      answer: response.answer,
      sources: uniquePages.map(page => `${page}`),
    });

  } catch (error: any) {
    console.error("Errore Chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}