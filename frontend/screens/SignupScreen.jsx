import { View , Text, Pressable, TextInput, useWindowDimensions } from "react-native"



function SignupScreen({setLoginScreen , styles}){

    const { width } = useWindowDimensions();
    const maxWidthStyle = {"maxWidth" : width > 520 ? 420 : '100%'};


    return (
        <View style={styles.screenContainer}>
            <Text style={styles.appName}>Test Creator</Text>
            <View style={styles.form}>
                <TextInput style={[styles.inputBox, maxWidthStyle ]}  placeholder="Name" />
                <TextInput style={[styles.inputBox, maxWidthStyle ]} placeholder="Email" />
                <TextInput style={[styles.inputBox, maxWidthStyle ]} placeholder="Password" />
                <TextInput style={[styles.inputBox, maxWidthStyle ]} placeholder="Confirm password"/>
                <Pressable style={[styles.primaryButton, maxWidthStyle ]}>
                    <Text style={styles.primaryButtonText}>Sign Up</Text>
                </Pressable>
                <Text>Already have an account?{' '}
                    <Text style={styles.link} onPress={() => {setLoginScreen(true)}} >
                        sign in
                    </Text>
                </Text>

            </View>
          
        </View>
    );
}

export default SignupScreen;

