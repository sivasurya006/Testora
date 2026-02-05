import { View, Text, Pressable, StyleSheet, Modal, Button, TextInput } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../../../../../styles/Colors';
import LabeledInput from '../../../../../../src/components/LabledInput';


export default function edit() {

    const [isAddQuesModalVisible, setAddQuesModalVisible] = useState(false);
    const openAddQuesModal = () => setAddQuesModalVisible(true);
    const closeAddQuesModal = () => setAddQuesModalVisible(false);

    return (
        <View class="page" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View>

            </View>
            <View>
                <Pressable onPress={openAddQuesModal}>
                    <Text>Add</Text>
                </Pressable>
            </View>

            {
                isAddQuesModalVisible ? (
                    <Modal
                        visible={isAddQuesModalVisible}
                        transparent
                        animationType='fade'
                        onRequestClose={closeAddQuesModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text>New Question</Text>
                                </View>
                                <View>
                                    <View style={styles.questionTypeModal} >
                                        <LabeledInput label={'Marks : '} placeholder={'5'} />
                                    </View>
                                    <View>
                                        <Text>
                                            Question :
                                        </Text>
                                        <TextInput
                                            style={styles.textArea}
                                            multiline={true}
                                            numberOfLines={4}
                                            placeholder="Type here..."
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row' , justifyContent:'space-between' }}>
                                        <Button title='add option' onPress={closeAddQuesModal} />
                                        <Button title='save' />  
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                ) : null
            }

        </View>
    )
}




const styles = StyleSheet.create({
    modalHeader: {

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 8,
        boxShadow: Colors.blackBoxShadow,
        maxWidth: 600,
        width: '100%'
    },
    questionTypeModal: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textArea: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
    },
})