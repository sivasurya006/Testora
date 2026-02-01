import { Stack } from 'expo-router'
import AuthContextProvider from '../util/AuthContext'
import { Provider as PaperProvider } from "react-native-paper"

export default function RootLayout() {
    return (

        <AuthContextProvider>
            <PaperProvider>
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
            </PaperProvider>
        </AuthContextProvider>
    )
}