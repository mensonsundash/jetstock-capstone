import { createContext, useCallback, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

// Global toast context
// This provides reusable toast notification functions across the app
export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // Internal toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  // Show any toast with custom severity
  const showToast = useCallback((message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  }, []);

  // Helper for success message
  const showSuccess = useCallback((message) => {
    showToast(message, "success");
  }, [showToast]);

  // Helper for error message
  const showError = useCallback((message) => {
    showToast(message, "error");
  }, [showToast]);

  // Helper for warning message
  const showWarning = useCallback((message) => {
    showToast(message, "warning");
  }, [showToast]);

  // Helper for info message
  const showInfo = useCallback((message) => {
    showToast(message, "info");
  }, [showToast]);

  // Close toast
  const handleClose = (_, reason) => {
    // Ignore clickaway close to avoid accidental dismissal
    if (reason === "clickaway") return;

    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Memoized context value to avoid unnecessary rerenders
  const value = useMemo(
    () => ({
      showToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }),
    [showToast, showSuccess, showError, showWarning, showInfo]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Global toast renderer */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};