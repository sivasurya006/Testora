import { StyleSheet, Text, View } from 'react-native'
import {  MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';


export default function EmptyClassroom({message}) {
    return (
        <View style={styles.container}>
            <View style={styles.emptyClassContainer}>
                <MaterialCommunityIcons name="google-classroom" size={30} color="black" />
                <Text>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyClassContainer : {
        alignItems: 'center',
        padding: 50,
        rowGap: 25,
        borderRadius: 8,
        backgroundColor: Colors.white,
        boxShadow : Colors.blackBoxShadow,
    }
})