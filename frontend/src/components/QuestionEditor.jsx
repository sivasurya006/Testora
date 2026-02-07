import { View, Text, Pressable, StyleSheet, Modal, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../styles/Colors'
import LabeledInput from './LabledInput'
import LabeledTextArea from './LabledTextArea'
import { Dropdown } from 'react-native-paper-dropdown'
import DropDown from 'react-native-paper-dropdown'
import MenuDropdown from './MenuDropdown'
import { BooleanComponent, FillBlankComponent, MCQComponent, SingleComponent } from './OptionComponents'


const options = [
    { optionText: 'Multi choice options', value: 'MCQ' },
    { optionText: 'Single choice', value: 'SINGLE' },
    { optionText: 'Boolean', value: 'BOOLEAN' },
    { optionText: 'Fill in the blanks', value: "FILL_BLANKS" }
]

export default function QuestionEditor({ onConfirm, onCancel }) {

    const [selected, setSelected] = useState(options[0]);

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeadText} >New Question</Text>
                </View>
                <View>
                    <View style={styles.questionTypeModal} >
                        <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: 300 }}>
                                <MenuDropdown options={options} backgroundColor={Colors.white} selected={selected} setSelected={setSelected} />
                            </View>
                            <LabeledInput label={'Marks : '} placeholder={'1'} customInputStyles={{ width: 50 }} inputType={'numeric'} />
                        </View>
                    </View>
                    <View>
                        <LabeledTextArea placeholder={'Type here'} label={'Question : '} customInputStyles={{ height: 100 }} isFillBlank={selected.value === 'FILL_BLANKS'} />
                    </View>
                    <View>
                        {
                            (() => {
                                switch (selected.value) {
                                    case 'MCQ':
                                        return (
                                            <MCQComponent/>
                                        );
                                    case 'SINGLE':
                                        return (
                                            <SingleComponent/>
                                        );
                                    case 'BOOLEAN':
                                        return (
                                            <BooleanComponent/>
                                        );
                                    default:
                                        return (
                                            <FillBlankComponent/>
                                        );
                                }
                            })()
                        }
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button title='save' onPress={onCancel} />
                    </View>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    modalHeader: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 10,
    },
    modalHeadText: {
        fontSize: 18,
        fontWeight: 600
    },
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 8,
        boxShadow: Colors.blackBoxShadow,
    },
    questionTypeModal: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})