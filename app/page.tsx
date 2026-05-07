"use client";

import { useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("front_image", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/analysis/start",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-5">
        AI 자세 분석 시스템
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        className="mt-5 px-4 py-2 bg-black text-white rounded"
        onClick={handleUpload}
      >
        분석 시작
      </button>

      {loading && (
        <p className="mt-5">분석 중...</p>
      )}

      {result && (
        <div className="mt-10 border p-5 rounded">
          <h2 className="text-2xl font-bold mb-3">
            분석 결과
          </h2>

          <pre>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}