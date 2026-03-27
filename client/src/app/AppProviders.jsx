import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "../context/AuthContext";
import { TempProvider } from "../context/TempContext";
import theme from "../theme/theme";


export const AppProviders = ({children}) => {
    return (
        // applies MUI theme globally
        <ThemeProvider theme={theme}>
            {/* reset browser default styles */}
            <CssBaseline />
                <TempProvider >
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </TempProvider>
                
            
        </ThemeProvider>
    );
};