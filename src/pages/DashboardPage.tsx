/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";
import { handleApi401 } from "../utils/authHelper";
import LoadingAnimation from "../components/LoadingAnimation";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

interface Subtest {
  id: number;
  name: string;
  description: string;
  question_count: number;
  duration: number;
}

interface ActiveQuiz {
  session_id: string;
  subtest_name: string;
  expires_at: string;
  questions: [];
}

const DashboardPage = () => {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeQuiz, setActiveQuiz] = useState({} as ActiveQuiz);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loadingQuizId, setLoadingQuizId] = useState<number | null>(null);
  const [totalAttemptedQuiz, setTotalAttemptedQuiz] = useState(0);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();

  const handleLogout = async () => {        
    await fetchAPI("/auth/logout", { method: "POST" }, true);
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }

  const getSubtests = async () => {    
    try {
      const res = await fetchAPI("/subtests", {
        method: "GET"
      });

      if (handleApi401(res, navigate)) return;
      
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      setSubtests(res.data || []);

    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveQuiz = async () => {
    const responseActiveQuiz = await fetchAPI("/quiz/active", {
        method: "GET"
    });
    if (handleApi401(responseActiveQuiz, navigate)) return;
    if (responseActiveQuiz.success) {
      setActiveQuiz(responseActiveQuiz.data || null);
    }
  };

  const handleStartQuiz = async (subtest:any) => {
    try {
      setLoadingQuizId(subtest.id);
      const res = await fetchAPI(`/quiz/start/${subtest?.id}`, {
        method: "GET",
      });
      if (handleApi401(res, navigate)) return;

      if (!res.success) {
        setOpen(true);
        setLoadingQuizId(null);
        return;
      }

      navigate("/quiz");

    } catch (error:any) {      
      toast.error(error);
    }finally {
      setLoadingQuizId(null);
    }
  };

  const getHistoryQuiz = async () => {
    try {
      const res = await fetchAPI("/quiz/history", {
        method: "GET"
      });

      if (handleApi401(res, navigate)) return;

      if (!res.success) {        
        setErrorMsg(res.message);
        return;
      }

      setTotalAttemptedQuiz(res.data.total_count || 0);

    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSubtests = subtests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase()) ||
    test.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubtests.length / ITEMS_PER_PAGE);

  const paginatedSubtests = filteredSubtests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    getSubtests();
    getActiveQuiz();
    getHistoryQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="p-8">
        <Modal
          open={open}
          setOpen={setOpen}
          title="Kuis Belum Selesai"
          description="Anda masih memiliki sesi kuis yang belum selesai. Lanjutkan kuis tersebut?"
          primaryAction={{
            label: "Ya",
            onClick: () => {
              setOpen(false)
              navigate("/quiz");
            },
            color: "yellow",
          }}
          secondaryAction={{
            label: "Batal",
            onClick: () => setOpen(false),
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Ambis</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm shadow-md transition"
        >
          Logout
        </button>
      </div>

      {isLoading && <LoadingAnimation/>}
      
      {errorMsg && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-6 border border-red-200 shadow-sm">
          {errorMsg}
        </div>
      )}

      {Object.keys(activeQuiz).length !== 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-md mb-6 border border-yellow-300 shadow-sm">
          <strong>Anda Belum Menyelesaikan Kuis {activeQuiz?.subtest_name}!</strong>
          <br />
          Klik disini untuk melanjutkan kuis yang sedang berjalan{" "}
          <button
            onClick={() => navigate("/quiz")}
            className="ml-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow-sm transition"
          >
            Lanjutkan Quiz
          </button>
        </div>
      )}

      {!isLoading && !errorMsg && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-tl from-cyan-200 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h4 className="text-lg font-medium">Total Kuis Tersedia</h4>
              <h2 className="text-2xl font-bold mt-2">{subtests.length}</h2>
            </div>

            <div className="bg-gradient-to-tl from-cyan-200 to-green-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <h4 className="text-lg font-medium">Total Kuis Pernah Dikerjakan</h4>
              <h2 className="text-2xl font-bold mt-2">{totalAttemptedQuiz}</h2>
            </div>
          </div>

          <input
            type="text"
            placeholder="Cari kuis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSubtests.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.name}</h3>
                  <p className="text-gray-500 text-sm">{test.description}</p>
                </div>
                <button
                  onClick={() => handleStartQuiz(test)}
                  disabled={loadingQuizId !== null}
                  className={`mt-4 w-full py-2 font-medium rounded-sm shadow-md transition ${
                    loadingQuizId !== null
                      ? "bg-blue-900 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loadingQuizId === test.id ? 'Loading kuis' : "Mulai Kuis"}
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8 flex-wrap">              
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full border transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          {paginatedSubtests.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              Tidak ada kuis yang tersedia.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;