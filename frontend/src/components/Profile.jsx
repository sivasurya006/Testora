import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { AppMediumText, AppSemiBoldText } from '../../styles/fonts'
import Colors from '../../styles/Colors';

export default function Profile({ name }) {

    if(!name) return;

    const firstLetter = name.charAt(0);

    return (
        <View style={{flexDirection : 'row' , alignItems : 'center' , gap : 6}}>
            <Pressable style={{height : 30 , width : 30 , backgroundColor : Colors.primaryColor , borderRadius : "50%" , alignItems : 'center' , justifyContent : 'center'}} >
                <AppSemiBoldText style={{color : 'white'}} >{firstLetter}</AppSemiBoldText>
            </Pressable>
            <AppMediumText style={{ fontSize: 16 }}>Siva surya</AppMediumText>
        </View>
    )
}