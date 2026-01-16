import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api";
import { useCallback } from "react";

interface Subtest {
  id: number;
  title: string;
  description: string;
  question_count: number;
  duration: number;
}

const DashboardPage = () => {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await fetchAPI("/auth/logout", { method: "POST" });
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, [navigate]);

  useEffect(() => {
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
        console.error("Dashboard Error:", error);
        setErrorMsg(error.message || "Gagal memuat data kuis.");

        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
            handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    getSubtests();
  }, [navigate, handleLogout]);

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

      {!isLoading && !errorMsg && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {subtests.map((test) => (
            <div key={test.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3 style={{ marginTop: 0 }}>{test.title}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{test.description}</p>
              
              <div style={{ margin: "15px 0", fontSize: "13px", color: "#444" }}>
                <strong>⏳ {test.duration} Menit</strong> | <strong>📝 {test.question_count} Soal</strong>
              </div>

              <button
                style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                onClick={() => alert(`Nanti ini akan memulai kuis: ${test.title}`)}
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