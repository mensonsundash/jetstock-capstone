import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "../context/AuthContext";
import theme from "../theme/theme";
import { ToastProvider } from "../context/ToastContext";


export const AppProviders = ({children}) => {
    return (
        // applies MUI theme globally
        <ThemeProvider theme={theme}>
            {/* reset browser default styles */}
            <CssBaseline />
                <ToastProvider >
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
        </ThemeProvider>
    );
};