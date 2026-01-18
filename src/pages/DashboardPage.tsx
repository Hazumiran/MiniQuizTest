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
  const navigate = useNavigate();

  const handleLogout = async () => {        
    await fetchAPI("/auth/logout", { method: "POST" }, true);
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }

  const getSubtests = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const data = await fetchAPI("/subtests", {
        method: "GET"
      });

      setSubtests(data.data || []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const parsedError = JSON.parse(error.message);
      setErrorMsg(parsedError.message);      

      if (parsedError.code === "INVALID_TOKEN" || parsedError.httpCode === 401) {
          handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveQuiz = async () => {
    const responseActiveQuiz =await fetchAPI("/quiz/active", {
        method: "GET"
    });
    setActiveQuiz(responseActiveQuiz.data || null);
  };

  useEffect(() => {
    getSubtests();
    getActiveQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartQuiz = async (subtestId:string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    try {
      await fetchAPI(`/quiz/start/${subtestId}`, {
        method: "GET",
      });

      navigate("/quiz");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      if (error.message.includes("409") || error.message.toLowerCase().includes("active quiz")) {
        const confirmResume = window.confirm(
          "Anda masih memiliki sesi kuis yang belum selesai. Lanjutkan kuis tersebut?"
        );
        
        if (confirmResume) {
          navigate("/quiz"); 
        }
      } else {
        alert(error.message || "Gagal memulai kuis.");
      }
    }
  };

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
          {subtests.map((test) => (
            <div key={test.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ marginTop: 0 }}>{test.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{test.description}</p>
              
              <button
                style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                onClick={() => handleStartQuiz(test.id.toString())}
              >
                Mulai Kuis
              </button>
            </div>
          ))}
          
          {subtests.length === 0 && <p>Tidak ada kuis yang tersedia saat ini.</p>}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;