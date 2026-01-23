import { View , Text, Pressable, TextInput, useWindowDimensions } from "react-native"


function SigninScreen({setLoginScreen , styles}){

    const { width } = useWindowDimensions();
    const maxWidthStyle = {"maxWidth" : width > 520 ? 420 : '100%'};

    return (
        <View style={styles.screenContainer}>
            <Text style={styles.appName}>Test Creator</Text>
            <View style={styles.form}>
                <TextInput style={[styles.inputBox, maxWidthStyle ]} placeholder="Email" />
                <TextInput style={[styles.inputBox, maxWidthStyle ]} placeholder="Password" />
                <Pressable style={[styles.primaryButton, maxWidthStyle ]}>
                    <Text style={styles.primaryButtonText}>Sign in</Text>
                </Pressable>
                <Text>Don't have an account?{' '}
                    <Text style={styles.link} onPress={() => {setLoginScreen(false)}} >
                        sign up
                    </Text>
                </Text>

            </View>
          
        </View>
    );
}

export default SigninScreen;