import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/theme";


export const AppProviders = ({children}) => {
    return (
        // applies MUI theme globally
        <ThemeProvider theme={theme}>
            {/* reset browser default styles */}
            <CssBaseline>
                {children}
            </CssBaseline>
        </ThemeProvider>
    );
};