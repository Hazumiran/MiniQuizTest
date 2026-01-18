const BASE_URL = import.meta.env.VITE_URL_BE;

export const fetchAPI = async (endpoint: string, options: RequestInit = {}, auth: boolean = true) => {
  const token = localStorage.getItem("accessToken");
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjk2OGQ5NDAzNzJjYmEzZmE1NDU2YTRhIiwicm9sZSI6InVzZXIiLCJpc3MiOiJtaW5pLXF1aXotYW1iaXMiLCJleHAiOjE3Njg2NjE5NTQsImlhdCI6MTc2ODU3NTU1NH0.qNG-4xaR9dECbQ59wuAKedzPnuW2s_2n8ga6o3Fcj40";

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && auth) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      httpCode: response.status,
      code: data.error?.code,
      message: data.error?.message,
      details: data.error?.details,
    };
  }

  return data;
};