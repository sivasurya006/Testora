import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AppMediumText, AppSemiBoldText } from '../../styles/fonts'
import Colors from '../../styles/Colors';
import * as Clipboard from 'expo-clipboard';

export default function Profile({ name, email }) {

    if (!name) return null;

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const firstLetter = name.charAt(0);

    return (
        <Pressable
            onHoverIn={() => setTooltipVisible(true)}
            onHoverOut={() => setTooltipVisible(false)}
            onPress={() => setTooltipVisible(!tooltipVisible)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, position: 'relative' }}>

                <View
                    style={{
                        height: 30,
                        width: 30,
                        backgroundColor: Colors.primaryColor,
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}

                >
                    <AppSemiBoldText style={{ color: 'white' }}>
                        {firstLetter}
                    </AppSemiBoldText>
                </View>

                <AppMediumText style={{ fontSize: 16 }}>
                    {name}
                </AppMediumText>


                {tooltipVisible && (
                    <Pressable
                        style={styles.tooltip}
                        onHoverIn={() => setTooltipVisible(true)}
                        onHoverOut={() => setTooltipVisible(false)}
                        onPress={async () => {
                            await Clipboard.setStringAsync(email);
                            setTooltipVisible(false);
                        }}
                    >
                        <AppSemiBoldText>{email}</AppSemiBoldText>
                    </Pressable>
                )}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        top: 30,
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,

        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,

        elevation: 5,
        // minWidth: 80,
        // maxWidth: 230,

    }
});