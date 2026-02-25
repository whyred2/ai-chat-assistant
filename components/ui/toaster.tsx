"use client";

import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      stacked
      hideProgressBar={true}
      position="bottom-right"
      autoClose={3000}
      transition={Bounce}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
      limit={10}
      icon={({ type }) => {
        switch (type) {
          case "success":
            return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
          case "error":
            return <XCircle className="h-5 w-5 text-red-500" />;
          case "info":
            return <Info className="h-5 w-5 text-cyan-500" />;
          case "warning":
            return <AlertTriangle className="h-5 w-5 text-amber-500" />;
          case "default":
            return <Loader2 className="h-5 w-5 animate-spin text-purple-500" />;
          default:
            return null;
        }
      }}
      className="max-[480px]:w-full!"
    />
  );
}
