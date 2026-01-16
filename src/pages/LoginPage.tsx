import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const token = result.data.access_token;
      
      localStorage.setItem("accessToken", token);

      alert("Login Berhasil!");
      navigate("/dashboard");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login Error:", error);
      
      setErrorMsg(error.message || "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>Login Quiz Ambis</h2>
      
      {errorMsg && (
        <div style={{ backgroundColor: "#ffdddd", color: "red", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Masukan password"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: "100%", 
            padding: "10px", 
            backgroundColor: isLoading ? "#ccc" : "#007BFF", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer" 
          }}
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <small>
          Belum punya akun? <a href="/register" style={{ color: "#007BFF" }}>Daftar di sini</a>
        </small>
      </div>
    </div>
  );
};

export default LoginPage;