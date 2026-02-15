import { StyleSheet } from "react-native";
import Colors from "./Colors";
import { fonts } from "./fonts";

const AuthStyles = StyleSheet.create({
    primaryButton : {
        width : "100%",
        paddingTop : 10,
        paddingBottom : 10,
        paddingLeft : 20,
        paddingRight : 20,
        backgroundColor : Colors.primaryColor,
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
        maxWidth : 420,
        alignItems : 'center',
        fontFamily: 'Arial'
    },
    inputBox: {
        backgroundColor: '#00000014',
        width: "100%",
        padding: 15,
        margin: 10,
        borderRadius: 8,
    },
    passwordBox: {
        flex : 1,
        padding: 15,
        outlineStyle : 'none'
    },
    passwordContainer : {
        flexDirection : 'row',
        backgroundColor: '#00000014',
        justifyContent : 'space-between',
        alignItems : 'center',
        width : "100%",
        borderRadius: 8,
        paddingRight: 15,
        borderWidth: 1,
        borderWidth : 2,
        margin: 10,
        borderColor : 'transparent'
    },
    focusedContainer: {
        borderColor: "black",
    },      
    appName : {
        fontSize : 30,
        marginBottom : 50,
        fontFamily : fonts.bold
    },
    link: {
        color: Colors.linkColor,              
        fontWeight: 600,             
        cursor : 'pointer',
    },
    appFirstName : {
        fontWeight : 900,
        color : Colors.brandColor_1
    },
    appLastName : {
        fontWeight : 600,
        color : Colors.brandColor_2
    },
    navLinkText : {
        marginVertical : 20,
        fontSize : 15
    }
});

export default AuthStyles;