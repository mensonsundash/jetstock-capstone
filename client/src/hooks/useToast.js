import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

// Reusable hook for global toast notifications
export const useToast = () => useContext(ToastContext);