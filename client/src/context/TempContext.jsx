import { createContext } from "react";


export const TempContext = createContext(); // create context

// temporary provider
export const TempProvider = ({children}) => {
    // store placeholder message
    const showMessage = (message) => {
        console.log("Temporary message:", message);
    };

    return(
        <TempContext.Provider value={{ showMessage }}>
            {children}
        </TempContext.Provider>
    );
}