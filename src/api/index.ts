const BASE_URL = import.meta.env.VITE_URL_BE;

export const fetchAPI = async (endpoint: string, options: RequestInit = {}, auth: boolean = true) => {
  const token = localStorage.getItem("accessToken");

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
  const result = JSON.stringify({
    httpCode: response.status,
    code: data.error?.code,
    message: data.error?.message,
  });
  if (!response.ok) {
    throw new Error(result);
  }

  return data;
};