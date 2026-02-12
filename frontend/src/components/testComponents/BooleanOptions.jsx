import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { fonts } from '../../../styles/fonts';

export default function BooleanOption({ options }) {

  const [selected,setSelected] = useState({});

  return (
    <View style={styles.optionContainer} >
      {options.map((opt, i) => {
        return (
          <View
            key={i}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              status={selected.optionId === opt.optionId ? 'checked' : 'unchecked'}
              onPress={() => setSelected(opt)}
            />
            <Text>{opt.optionText}</Text>
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