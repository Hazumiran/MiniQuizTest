/* eslint-disable react-hooks/exhaustive-deps */
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

      navigate("/dashboard", { replace: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error.message || "Login Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
    // localStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjk2OGQ5NDAzNzJjYmEzZmE1NDU2YTRhIiwicm9sZSI6InVzZXIiLCJpc3MiOiJtaW5pLXF1aXotYW1iaXMiLCJleHAiOjE3Njg2NjE5NTQsImlhdCI6MTc2ODU3NTU1NH0.qNG-4xaR9dECbQ59wuAKedzPnuW2s_2n8ga6o3Fcj40")
  }, []);

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