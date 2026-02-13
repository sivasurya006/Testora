import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper';
import { fonts } from '../../../styles/fonts';

export default function McqOptions({ options }) {

    const [checked, setChecked] = useState([]);

    const toggle = (opt) => {
        if (checked.includes(opt)) {
            return checked.filter(it => it !== opt);
        }
        return [...checked, opt];
    };

    return (
        <View style={styles.optionContainer} >
            {options.map((opt, i) => {
                const isChecked = checked.includes(opt);
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} key={i}>

                        <Checkbox
                            status={isChecked ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(toggle(opt))}
                        />
                        <Text
                            style={[styles.optionText]}
                        >{opt.optionText}</Text>

                    </View>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    optionContainer: {
        marginVertical: 6,
        gap: 10,
        margin : 'auto',
        paddingTop : 50
    },
    optionText : {
        fontSize : 18,
        fontFamily : fonts.regular,
        // fontWeight : 500
    }
})