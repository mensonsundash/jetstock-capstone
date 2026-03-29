import { Box, CircularProgress } from "@mui/material";

// Reusable smooth MUI page loader 
const Loader = () => {
    return(
        <Box 
        display="flex"
        justifyContent="center"
        alignContent="center"
        minHeight="60vh"
        >
            <CircularProgress />
        </Box>
    );
};

export default Loader;