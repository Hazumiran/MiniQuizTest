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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-100">
      <div className="w-full max-w-md mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login Quiz Ambis</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-5 rounded-md border border-red-200 shadow-sm animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukan password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>

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

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline hover:text-blue-700">
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;