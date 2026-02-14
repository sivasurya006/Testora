import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Checkbox } from 'react-native-paper';
import { fonts } from '../../../styles/fonts';

export default function McqOptions({ options , selected , onSelect }) {


    return (
        <View style={styles.optionContainer} >
            {options.map((opt, i) => {
                const isChecked = selected.some(o => o.optionId === opt.optionId);
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} key={i}>

                        <Checkbox
                            status={isChecked ? 'checked' : 'unchecked'}
                            onPress={() => onSelect(opt)}
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