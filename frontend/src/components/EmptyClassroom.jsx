import { StyleSheet, View, Pressable, Dimensions } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { AppBoldText, AppRegularText } from '../../styles/fonts';


const { width } = Dimensions.get('window');

export default function EmptyClassroom({ message, onPress, ctaText = 'Create New Classroom' }) {
    return (
        <View style={styles.container}>
            {onPress ? (
                <Pressable style={[styles.emptyClassContainer, styles.emptyClassContainerPressable]} onPress={onPress}>
                    <View style={styles.plusWrap}>
                        <AntDesign name="plus" size={26} color={Colors.primaryColor} />
                    </View>
                    <AppBoldText style={styles.ctaTitle}>{ctaText}</AppBoldText>
                    <AppRegularText style={styles.messageText}>{message}</AppRegularText>
                </Pressable>
            ) : (
                <View style={styles.emptyClassContainer}>
                    <View style={styles.plusWrap}>
                        <AntDesign name="plus" size={26} color={Colors.primaryColor} />
                    </View>
                    <AppBoldText style={styles.ctaTitle}>{ctaText}</AppBoldText>
                    <AppRegularText style={styles.messageText}>{message}</AppRegularText>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    emptyClassContainer : {
        width: '100%',
        maxWidth: width > 400 ? 380 : 340,
        minHeight: 250,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 26,
        rowGap: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dotted',
        borderColor: Colors.primaryColor + '66',
        backgroundColor: Colors.white,
        marginVertical: 8,
        marginHorizontal: 10,
        boxShadow: Colors.blackBoxShadow,
        elevation: 6,
    },
    emptyClassContainerPressable: {
        cursor: 'pointer',
    },
    plusWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.primaryColor + '14',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaTitle: {
        color: Colors.secondaryColor,
        fontSize: 18,
    },
    messageText: {
        color: Colors.lightFont,
        textAlign: 'center',
    },
})
