import { View, Text, Pressable, TextInput, ActivityIndicator, TouchableOpacity } from "react-native"
import { Link, router, useGlobalSearchParams } from "expo-router"
import AuthformStyles from '../styles/AuthformStyles'
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../util/AuthContext";
import api from "../util/api";
import { isStrongPassword, isValidEmail } from "../util/inputValidator";

export default function Signin() {

    const styles = AuthformStyles;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState(false);
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { redirect } = useGlobalSearchParams();

    const signUpPageLink = redirect ? `signup?redirect=${encodeURIComponent(redirect)}` : 'signup';

    async function handleSignin() {
        if (!isValidEmail(email) && 0) {
            setErrorMessage("Please enter valid emai");
            return;
        }
        if (password.trim().length == 0) {
            setErrorMessage("Please enter password");
            return;
        }
        try{
            const result = await authContext.signIn(email, password);
            if (result.success) {
                if(redirect){
                    router.replace(redirect);
                }else{
                    router.replace('/')
                }
            } else {
                console.log(result.error);
                setErrorMessage("Invalid email or Password")
            }
        }catch(err){
            setErrorMessage("Invalid email or Password")
        }
    }

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.appName}><Text style={styles.appFirstName}>Test</Text>{' '}<Text style={styles.appLastName}>Creator</Text></Text>
            <View style={styles.form}>
                <TextInput
                    autoComplete="email"
                    onChangeText={(text) => setEmail(text)}
                    style={styles.inputBox} placeholder="Email" />

                <View style={[styles.passwordContainer, focused && styles.focusedContainer]}>
                    <TextInput style={styles.passwordBox}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        autoComplete="off"
                        onChangeText={(text) => setPassword(text)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        underlineColorAndroid="transparent"
                    />

                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} />
                    </TouchableOpacity>
                </View>

                <Pressable
                    style={styles.primaryButton}
                    onPress={handleSignin}
                    disabled={authContext.isLoading}>
                    {authContext.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Sign in</Text>
                    )}
                </Pressable>

                {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

                <Text style={styles.navLinkText}>Don't have an account?{' '}
                    <Text onPress={() => router.replace(signUpPageLink)} style={styles.link} href={signUpPageLink}>sign up</Text>
                </Text>

            </View>

        </View>
    )
}

