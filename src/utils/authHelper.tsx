import type { NavigateFunction } from "react-router-dom";

let alreadyHandled401 = false;
export const handleApi401 = (
  res: { httpCode: number },
  navigate: NavigateFunction
) => {
  if (res.httpCode === 401 && !alreadyHandled401) {
    alreadyHandled401 = true;
    localStorage.removeItem("accessToken");
    alert("Sesi Anda telah berakhir. Silakan login kembali.");
    navigate("/login", { replace: true });
    return true;
  }
  return false;
};
