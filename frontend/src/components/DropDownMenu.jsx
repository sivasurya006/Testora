import { View, Text, StyleSheet, Pressable } from 'react-native'

export default function DropDownMenu({ options }) {
    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                {options.map(opt => 
                <Pressable onPress={() => opt.action()}>
                    <Text>{opt.name}</Text>
                </Pressable>)}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        top : 2
    },
    menu : {

    }
});