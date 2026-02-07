import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import { Menu } from 'react-native-paper'

export default function MenuDropdown({ options, backgroundColor, selected, setSelected }) {
    const [visible, setVisible] = useState(false);

    const { width } = useWindowDimensions();

    return (
        <Menu
            style={{ maxWidth : 300 }}
            contentStyle={{
                backgroundColor: backgroundColor,
                padding : 10,
                borderRadius : 8
            }}
            key={visible ? 'open' : 'closed'}
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
                <Pressable
                    style={styles.dropdown}
                    onPress={() => setVisible(true)}
                >
                    <View style={styles.dropdownContent}>
                        <Text style={styles.dropdownText}>
                            {selected ? selected.optionText : 'Select an option'}
                        </Text>
                        <Ionicons name={visible ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
                    </View>
                </Pressable>
            }
            anchorPosition='bottom'
        >
            {options.map((opt, i) => (
                <Menu.Item key={i}
                    titleStyle={{
                        flexWrap: 'wrap',                 // it  allow multiLine
                        whiteSpace: 'normal',             // for  web compatibility
                    }}
                    title={opt.optionText}
                    onPress={() => { setSelected(opt); setVisible(false); }}
                    leadingIcon={selected === opt ? 'check-circle' : 'circle-outline'}
                />
            ))}
        </Menu>
    )
}


const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        maxWidth: 300,
    },
    dropdownContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 15,
        color: 'black',
    },
})