import { View, Text, Pressable, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { Link, router, useGlobalSearchParams } from "expo-router"
import AuthformStyles from '../styles/AuthformStyles'
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../util/AuthContext";
import { isStrongPassword, isValidEmail, isValidName } from "../util/inputValidator";
import api from "../util/api";

export default function Signup() {
    const styles = AuthformStyles;
    const authContext = useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [focused, setFocused] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [confirmFocused, setConfirmFocused] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { redirect } = useGlobalSearchParams();

    async function handleSignup() {
        if (!isValidName(name)) {
            setErrorMessage("Please enter name")
            return;
        }
        if (!isValidEmail(email) && 0)  {
            setErrorMessage("Please enter valid emai");
            return;
        }
        if (!isStrongPassword(password)) {
            setErrorMessage("Password needs 8+ characters, with uppercase, lowercase, number, and symbol");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Password and Confirm password  mismatch");
            return;
        }

        const result = await authContext.signUp(name, email, password);

        if (result.success) {
            if(redirect){
                router.replace(redirect);
            }else{
                router.replace('/')
            }
        } else {
            if (result.status && result.status === 409) {
                setErrorMessage("Account already registered with this email. Try to signin")
                return;
            }
            console.log(result.error);
            setErrorMessage("Can't create an account. Try again");
        }

    }


    const signinPageLink = redirect ? `/signin?redirect=${redirect}` : '/signin';

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.appName}><Text style={styles.appFirstName}>Test</Text>{' '}<Text style={styles.appLastName}>Creator</Text></Text>
            <View style={styles.form}>
                <TextInput style={styles.inputBox} placeholder="Name" onChangeText={(text) => setName(text)} />
                <TextInput style={styles.inputBox} placeholder="Email" onChangeText={(text) => setEmail(text)} />
                <View style={[styles.passwordContainer, focused && styles.focusedContainer]}>
                    <TextInput style={styles.passwordBox}
                        secureTextEntry={!passwordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Password"
                        onChangeText={(text) => setPassword(text)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        underlineColorAndroid="transparent"
                    />

                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.passwordContainer, confirmFocused && styles.focusedContainer]}>
                    <TextInput style={styles.passwordBox}
                        secureTextEntry={!confirmPasswordVisible}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Confirm Password"
                        onChangeText={(text) => setConfirmPassword(text)}
                        onFocus={() => setConfirmFocused(true)}
                        onBlur={() => setConfirmFocused(false)}
                        underlineColorAndroid="transparent"
                    />

                    <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                        <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={20} />
                    </TouchableOpacity>
                </View>
                <Pressable
                    style={styles.primaryButton}
                    onPress={handleSignup}
                    disabled={authContext.isLoading}
                >
                    {authContext.isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.primaryButtonText}>Sign up</Text>
                    )}
                </Pressable>

                {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

                <Text style={styles.navLinkText}>Already have an account?{' '}
                    <Text onPress={() => router.replace(signinPageLink)} style={styles.link}>sign in</Text>
                </Text>

            </View>

        </View>
    )
}