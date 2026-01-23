import { StyleSheet } from "react-native";
import SignupScreen from "./SignupScreen";
import SigninScreen from "./SigninScreen"
import { useState  } from "react";

function AuthenticationScreen(){

    const [showLoginScreen,setLoginScreen] = useState(false);

    console.log(setLoginScreen)

    return (
        showLoginScreen ? <SigninScreen  styles = {styles} setLoginScreen={setLoginScreen}/> : <SignupScreen styles = {styles} setLoginScreen={setLoginScreen}/>
    );
}

const styles = StyleSheet.create({
    primaryButton : {
        width : "100%",
        paddingTop : 10,
        paddingBottom : 10,
        paddingLeft : 20,
        paddingRight : 20,
        backgroundColor : '#2E6DEB',
        borderRadius : 4,
        margin : 10    
    },
    primaryButtonText : {
        color : 'white',
        fontSize : 16,
        fontWeight : 500,
        letterSpacing : 0.5,
        textAlign : 'center'
    },
    screenContainer : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        padding : 20,
        backgroundColor : 'white'
    },
    form : {
        width : "100%",
        alignItems : 'center',
        fontFamily: 'Arial'
    },
    inputBox :  {
        backgroundColor : '#00000014',
        width : "100%",
        padding : 15,
        margin : 10,
        borderRadius : 8
    },
    appName : {
        fontSize : 30,
        marginBottom : 50
    },
    link: {
        color: '#2E6DEB',             
        textDecorationLine: 'underline', 
        fontWeight: '500',             
        cursor : 'pointer'
      },
      
      
})

export default AuthenticationScreen;