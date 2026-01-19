/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";
import LoadingAnimation from "../components/LoadingAnimation";
import toast from "react-hot-toast";
import { handleApi401 } from "../utils/authHelper";

interface QuizDetail {
  id: string;
  session_id: string;
  subtest_name: string;
  score: number;
  percentage: number;
  total_questions: number;
  correct_answers: number;
  total_time_seconds: number;
  average_time_per_question: number;
  completed_at: string;
}

const HistoryDetailPage = () => {
  const { session_id } = useParams<{ session_id: string }>();
  const [detail, setDetail] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadDetail = async () => {
    if (!session_id) return;
    setIsLoading(true);
    try {
      const res = await fetchAPI(`/quiz/result/${session_id}`, {
        method: "GET",
      });
      if (handleApi401(res, navigate)) return;
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setDetail(res.data.result);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [session_id]);

  if (isLoading) return <LoadingAnimation/>;
  if (!detail) return <div className="text-center py-20 text-gray-500">Detail tidak ditemukan</div>;

  return (
    <div className="mt-20 p-4 max-w-2xl mx-auto font-sans">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow">
        <h2 className="text-2xl font-bold">{detail.subtest_name}</h2>
        <div className="mt-4 flex flex-col gap-2 text-white/90">
          <div>Score: {detail.score}</div>
          <div>Persentase: {detail.percentage}%</div>
          <div>Jumlah Soal: {detail.total_questions}</div>
          <div>Benar: {detail.correct_answers}</div>
          <div>Total Waktu: {Math.floor(detail.total_time_seconds / 60)}m {detail.total_time_seconds % 60}s</div>
          <div>Rata-rata Waktu / Soal: {detail.average_time_per_question.toFixed(1)}s</div>
          <div>Selesai: {new Date(detail.completed_at).toLocaleString()}</div>
        </div>
      </div>
      <button
          onClick={() => navigate(-1)}
          className='mt-4 w-full py-3 rounded-sm font-semibold text-white text-lg transition duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
        >
          Kembali
        </button>
    </div>
  );
};

export default HistoryDetailPage;
