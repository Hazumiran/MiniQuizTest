import { Toaster } from "react-hot-toast";

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: "sans-serif",
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "8px",
        },
        success: {
          style: {
            background: "#4ade80",
            color: "#ffffff",
          },
        },
        error: {
          style: {
            background: "#f87171",
            color: "#ffffff",
          },
        },
      }}
    />
  );
};

export default Toast;
