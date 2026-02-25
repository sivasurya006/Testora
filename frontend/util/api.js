import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useRouter } from "expo-router";
console.log("hello")
const api = axios.create({
    baseURL: Platform.OS == 'web' ? 'http://localhost:8080/testcreator/api' : "http://192.168.43.241:8080/testcreator/api",
    timeout: 10000,
    headers: {
        'X-Client-Type': Platform.OS == 'web' ? 'web' : 'mobile'
    },
    withCredentials: Platform.OS == 'web' && true
});

// console.log(api.interceptors)

api.interceptors.request.use(async (config) => {

    if (Platform.OS != 'web') {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log(token, "Added");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return config;

});

api.interceptors.response.use(null, (error) => {
    if (error.response?.status === 401) {
        const redirect = error.response.data?.redirectURI;
        if(typeof error.response.data?.message === 'string' && error.response.data.message.includes("Invalid email or password")){
            return;
        } 
        let navLink = '/signin';
        if (redirect) {
            navLink += `?redirect=${redirect}`;
        }
        router.replace(navLink);
    }
    throw error;
});


export default api;
