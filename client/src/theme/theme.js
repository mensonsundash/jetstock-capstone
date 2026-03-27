import { createTheme } from "@mui/material/styles";

// this theme will defines JetStock app colors, background etc
const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#2e7d32",
        },
        background: {
            default: "#f5f7fb",
            paper: "#ffffff"
        }
    },
    shape: {
        borderRadius: 10
    },
    typography: {
        fontFamily: `"Roboto", "Helvetica", "Arial", san-serif`,
        h4: {
            fontWeight: 700
        },
        h5: {
            fontWeight: 600
        },
        h6: {
            fontWeight: 600
        },

    }
});

export default theme;