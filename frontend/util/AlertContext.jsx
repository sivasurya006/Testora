import { View, Text } from 'react-native'
import React, { createContext, useState } from 'react'

export const AlertContext = createContext();


export default function AlertProvider({ children }) {
    
    const [ alertVisible , setAlertVisible ] = useState(false);

    return (
        <AlertContext.Provider  value={{setAlertVisible , alertVisible}}>
            {children}
        </AlertContext.Provider>
    )
}