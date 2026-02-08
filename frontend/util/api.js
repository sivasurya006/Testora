import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router, useRouter } from "expo-router";
console.log("hello")
const api = axios.create({
    baseURL: Platform.OS == 'web' ? 'http://localhost:8080/testcreator/' : "http://192.168.20.6:8080/testcreator/",
    timeout: 10000,
    headers: {
        'X-Client-Type': Platform.OS == 'web' ? 'web' : 'mobile'
    },
    withCredentials: Platform.OS == 'web' && true
});


// console.log(api.interceptors)
api.interceptors.request.use(async (config) => {
    // console.log(config);

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
        router.replace('/signin');

    }
    throw error;
});


export default api;