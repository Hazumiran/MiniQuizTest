/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../api"; 
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      if (!res.success) {
        setErrorMsg(res.details || "Register Error");
        return;
      }
      toast.success("Registrasi Berhasil! Silakan Login dengan akun baru Anda.");
      navigate("/login");

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
  }, []);


  return (
    <AuthCard
      title="Daftar Akun Baru"
      errorMsg={errorMsg}
      footerText="Sudah punya akun?"
      footerLink={{ to: "/login", label: "Login di sini" }}
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Lengkap"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-sm font-semibold text-white text-lg transition duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {isLoading ? "Memproses..." : "Daftar Sekarang"}
        </button>
      </form>
    </AuthCard>

  );
};

export default RegisterPage;