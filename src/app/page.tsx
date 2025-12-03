"use client";
import { useState } from "react";
import { Upload, Send, FileText, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string; sources?: any[] }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      setChatReady(true);
      setMessages([{ role: "ai", content: `I've read "${file.name}". Ask me anything about it!` }]);
    } else {
      alert("Upload failed.");
    }
    setUploading(false);
  };

  const handleChat = async () => {
    if (!input || !file) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg, fileName: file.name }),
    });
    
    const data = await res.json();
    setMessages((prev) => [
      ...prev, 
      { role: "ai", content: data.answer, sources: data.sources }
    ]);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        
        <div className="p-6 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText /> DocuChat
          </h1>
          <p className="text-indigo-100 mt-2">Carica un file PDF e comincia ad imparare.</p>
        </div>

        {!chatReady ? (
          <div className="p-8 flex flex-col items-center gap-4">
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
              {uploading ? "Indexing..." : "Upload & Analyze"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-lg ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-white border shadow-sm"}`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                        Sources: Page {m.sources.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && <Loader2 className="animate-spin text-indigo-600 mx-auto" />}
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button 
                onClick={handleChat} 
                disabled={loading}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}