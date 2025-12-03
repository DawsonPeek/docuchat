import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from "@/lib/pinecone";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const loader = new PDFLoader(blob);
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(rawDocs);

    splitDocs.forEach((doc) => {
      if (doc.metadata.loc && doc.metadata.loc.pageNumber !== undefined) {
        doc.metadata.pageNumber = doc.metadata.loc.pageNumber;
      }
    });

    console.log(`Caricamento su Pinecone Index: ${process.env.PINECONE_INDEX}`);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "text-embedding-004",
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX!);
    
    await PineconeStore.fromDocuments(splitDocs, embeddings, {
      pineconeIndex: index,
      namespace: file.name,
    });

    return NextResponse.json({ success: true, message: "Indicizzazione completata" });

  } catch (error: any) {
    console.error("Errore Upload:", error);
    return NextResponse.json({ error: error.message || "Errore sconosciuto" }, { status: 500 });
  }
}