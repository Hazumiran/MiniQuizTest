/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";

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

      if (!res.success) {
        if (res.code === "INVALID_TOKEN" || res.httpCode === 401) {
            handleLogout();
        }
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
    const responseActiveQuiz =await fetchAPI("/quiz/active", {
        method: "GET"
    });
    if (responseActiveQuiz.success) {
      setActiveQuiz(responseActiveQuiz.data || null);
    }
  };

  const handleStartQuiz = async (subtest:any) => {
    try {
      const res = await fetchAPI(`/quiz/start/${subtest?.id}`, {
        method: "GET",
      });

      if (!res.success) {
        // console.log(subtest);
        const confirmResume = window.confirm(
          "Anda masih memiliki sesi kuis yang belum selesai. Lanjutkan kuis tersebut?"
        );
        
        if (confirmResume) {
          navigate("/quiz"); 
        }

        return;
      }

      navigate("/quiz");

    } catch (error:any) {
      console.error(error);
      alert("Terjadi kesalahan saat memulai kuis.");
    }
  };

  const getHistoryQuiz = async () => {
    try {
      const res = await fetchAPI("/quiz/history", {
        method: "GET"
      });

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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    getSubtests();
    getActiveQuiz();
    getHistoryQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Dashboard Ambis</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {isLoading && <p>Memuat data...</p>}
      
      {errorMsg && (
        <div style={{ backgroundColor: "#ffe6e6", color: "red", padding: "10px", borderRadius: "5px", marginBottom: "20px" }}>
          {errorMsg}
        </div>
      )}
      {Object.keys(activeQuiz).length !== 0 && (
        <div style={{ backgroundColor: "#fff3cd", color: "#856404", padding: "15px", borderRadius: "5px", marginBottom: "20px", border: "1px solid #ffeeba" }}>
          <strong>Anda Belum Menyelesaikan Kuis {activeQuiz?.subtest_name}!</strong> 
          <br />
          Klik disini untuk melanjutkan kuis yang sedang berjalan <button onClick={() => navigate("/quiz")}>Lanjutkan Quiz</button>.
        </div>
      )}

      {!isLoading && !errorMsg && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(700px, 1fr))", gap: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px"
            }}
          >
            <div
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <h4 style={{ margin: 0, fontWeight: "normal" }}>Total Kuis Tersedia</h4>
              <h2 style={{ margin: "10px 0 0" }}>{subtests.length}</h2>
            </div>

            <div
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <h4 style={{ margin: 0, fontWeight: "normal" }}>
                Total Kuis Pernah Dikerjakan
              </h4>
              <h2 style={{ margin: "10px 0 0" }}>{totalAttemptedQuiz}</h2>
            </div>
          </div>

          <input
            type="text"
            placeholder="Cari kuis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          {paginatedSubtests.map((test) => (
            <div key={test.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ marginTop: 0 }}>{test.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{test.description}</p>
              
              <button
                style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                onClick={() => handleStartQuiz(test)}
              >
                Mulai Kuis
              </button>
            </div>
          ))}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "30px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    fontWeight: page === currentPage ? "bold" : "normal",
                    backgroundColor: page === currentPage ? "#007BFF" : "white",
                    color: page === currentPage ? "white" : "black",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
          {paginatedSubtests.length === 0 && (
            <p style={{ textAlign: "center" }}>
              Tidak ada kuis yang tersedia.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;