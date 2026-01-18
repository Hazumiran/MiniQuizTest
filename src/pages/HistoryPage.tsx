/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchAPI } from "../api";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import { handleApi401 } from "../utils/authHelper";
import toast from "react-hot-toast";

interface QuizHistoryItem {
  id: string;
  session_id: string;
  subtest_name: string;
  score: number;
  percentage: number;
  total_questions: number;
  correct_answers: number;
  total_time_seconds: number;
  completed_at: string;
}

interface QuizHistoryResponse {
  results: QuizHistoryItem[];
  total_count: number;
  current_page: number;
  total_pages: number;
  limit: number;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const loadHistory = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const res = await fetchAPI(`/quiz/history?limit=${limit}&offset=${offset}`, {
        method: "GET",
      });
      if (handleApi401(res, navigate)) return;
      if (!res.success) {
        toast.error(res.message || "Gagal memuat data history");
        return;
      }
      const data: QuizHistoryResponse = res.data;
      setHistory(data.results);
      setCurrentPage(data.current_page);
      setTotalPages(data.total_pages);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Riwayat Kuis</h1>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="limit" className="text-gray-700 font-medium">
          Tampilkan per halaman:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingAnimation/>
      ) : history.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Belum ada history kuis</div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div
                key={item.id}
                onClick={() => navigate(`/history/${item.session_id}`)}
                className="p-4 rounded-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg text-white cursor-pointer shadow hover:scale-105 transform transition"
            >
                <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{item.subtest_name}</h2>
                <span className="font-mono">{item.percentage}%</span>
                </div>
                <div className="flex justify-between mt-2 text-sm opacity-90">
                <span>Benar: {item.correct_answers}/{item.total_questions}</span>
                <span>Waktu: {Math.floor(item.total_time_seconds / 60)}m {item.total_time_seconds % 60}s</span>
                <span>{new Date(item.completed_at).toLocaleString()}</span>
                </div>
            </div>
            ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
