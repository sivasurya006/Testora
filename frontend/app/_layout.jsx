import { Stack } from 'expo-router'
import AuthContextProvider from '../util/AuthContext'
import { Provider as PaperProvider } from "react-native-paper"
import { MD3LightTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        onSurface: '#000000',          // menu text
        onSurfaceVariant: '#000000',   // menu secondary text
        surface: '#ffffff',            // modal bg

    },
};


console.log({ ...MD3LightTheme.colors })

export default function RootLayout() {

  const [loaded] = useFonts({
    InterRegular: require('../assets/fonts/Inter_18pt-Regular.ttf'),
    InterMedium: require('../assets/fonts/Inter_18pt-Medium.ttf'),
    InterSemiBold: require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    InterBold: require('../assets/fonts/Inter_18pt-Bold.ttf'),
  });

  if (!loaded) return null;

    return (
        <AuthContextProvider>
            <PaperProvider theme = {theme}>
                <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
            </PaperProvider>
        </AuthContextProvider>
    )
}