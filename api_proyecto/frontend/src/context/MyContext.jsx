import { createContext, useState } from "react"
export const AppContext = createContext()
export const AppProvider = ({ children }) => {
    const [coordinates, setCoordinates] = useState([])
    
   
    return <AppContext.Provider value={{  coordinates, setCoordinates}}>
        {children}
    </AppContext.Provider>
}