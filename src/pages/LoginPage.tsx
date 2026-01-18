/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api"; 
import AuthCard from "../components/AuthCard";

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
      const res = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!res.success) {
        setErrorMsg(res.message || "Login Error");
        return;
      }

      const token = res.data.access_token;
      
      localStorage.setItem("accessToken", token);

      navigate("/dashboard", { replace: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
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
    <AuthCard
      title="Login Quiz Ambis"
      errorMsg={errorMsg}
      footerText="Belum punya akun?"
      footerLink={{ to: "/register", label: "Daftar di sini" }}
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {isLoading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;