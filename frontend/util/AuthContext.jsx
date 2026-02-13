import { router } from "expo-router";
import { createContext, useEffect, useState } from "react";
import api from "./api";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

    const [isLoading, setLoading] = useState(false);

    {/**
        This effect run for check the current user is Logged in after refresh
    */}

    {/** For authentication check we don't need separate api. 
        Bcz we handle it on server (if any unauthorized request happens server respond with 401) 
        check api.interceptors.response in ./uti/api.js  */}

    // useEffect(() => {
    //     const checkIsLoggedIn = async () => {
    //       try {
    //         const res = await api.get('/api/isLoggedin');
    //         setLoggedIn(res.data);
    //       } catch (e) {
    //         setLoggedIn(false);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    //     checkIsLoggedIn();
    //   }, []);

    {/** For authentication check we don't need separate api. 
        Bcz we handle it on server (if any unauthorized request happens server respond with 401) 
        check api.interceptors.response in ./uti/api.js  */}

    // useEffect(() => {
    //     const checkIsLoggedIn = async () => {
    //       try {
    //         const res = await api.get('/api/isLoggedin');
    //         setLoggedIn(res.data);
    //       } catch (e) {
    //         setLoggedIn(false);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    //     checkIsLoggedIn();
    //   }, []);

    async function signUp(userName, userEmail, userPassword) {
        setLoading(true);
        try {
            const res = await api.post('/signup', { userName, userEmail, userPassword }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!res) return
            if (!res.data.success) {
                const errorText = res.data.message;
                console.log("Signup error:", errorText);
                return { success: false, error: errorText };
            }

            router.replace('/');

            {/** If the client from mobile we need to store the token in SecureStore Memory in mobile (ios/android) */ }
            if (Platform.OS != 'web') {
                await SecureStore.setItemAsync("token", res.data.token);
                // TODO implement logger  console.log('token added')
            }

            return { success: true };

        } catch (err) {
            // TODO implement logger (sign up failed)
            console.log("catch calledd")

            if (err.response?.status == 409) {
                return { success: false, error: "User already exist", status: 409 };
            }
            return { success: false, error: err.message };
        } finally {
            setLoading(false)
        }
    }

    async function signIn(userEmail, userPassword) {

        setLoading(true);

        try {
            const res = await api.post("/signin", { userEmail, userPassword }, {
                'Content-Type': 'application'
            });
            if(!res) return
            if (!res.data.success) {
                const errorText = res.data.message;
                console.log("Signin error:", errorText);
                return { success: false, error: errorText };
            }
            console.log("catch called")
            router.replace('/');
            {/** If the client from mobile we need to store the token in SecureStore Memory in mobile (ios/android) */ }
            if (Platform.OS != 'web') {
                await SecureStore.setItemAsync("token", res.data.token);
                // TODO implement logger  console.log('token added')
            }
            return { success: true };
        } catch (e) {
            // TODO implement logger (sign in failed)
            console.log("catch called")
            return { success: false, error: e.message };
        } finally {
            setLoading(false);
        }
    }

    function signOut() {

        setLoggedIn(false);
        router.replace('/signin');
    }

    return (

        <AuthContext.Provider value={{ isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>

    );

}
