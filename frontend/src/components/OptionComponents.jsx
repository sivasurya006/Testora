import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Colors from '../../styles/Colors';


const MCQComponent = ({ giveOptionMarks ,options ,setOptions }) => {
    
    useEffect(() => {
        setOptions([
            { optionText: '', isCorrect: false , mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
        ]);
    },[]);

    const toggleCorrect = index => {
        const newOptions = [...options];
        newOptions[index].isCorrect = !newOptions[index].isCorrect;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { optionText: '', isCorrect: false }]);
    }

    const insertOption = index => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, { optionText: '', isCorrect: false })
        setOptions(newOptions);
    };

    const removeOption = index => {
        console.log(options.length)
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    }


    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].optionText = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.optionText}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                value={opt.mark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].mark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    <Checkbox
                        status={opt.isCorrect ? 'checked' : 'unchecked'}
                        onPress={() => toggleCorrect(idx)}
                        color="green"
                    />


                    <Pressable style={styles.icons} onPress={() => insertOption(idx)}>
                        <Ionicons name="add" size={20} color={Colors.secondaryColor} />
                    </Pressable>

                    <Pressable style={styles.icons} onPress={() => removeOption(idx)}>
                        <Ionicons name="close" size={20} color="red" />
                    </Pressable>

                </View>
            ))}

            {
                options.length == 0 ? (
                    <Pressable style={styles.icons} onPress={addOption}>
                        <Text style={styles.addNewOption}>Add Option</Text>
                    </Pressable>
                ) : null
            }
        </View>
    );
};


const SingleComponent = ({ giveOptionMarks ,options ,setOptions  }) => {
    useEffect(() => {
        setOptions([
            { optionText: '', isCorrect: false , mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
        ]);
    },[]);

    const addOption = () => {
        setOptions([...options, { optionText: '', isCorrect: false }]);
    }

    const toggleCorrect = index => {
        const newOptions = options.map(opt => {
            opt.isCorrect = false
            return opt;
        });
        newOptions[index].isCorrect = !newOptions[index].isCorrect;
        setOptions(newOptions);
    };

    const insertOption = index => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, { optionText: '', isCorrect: false })
        setOptions(newOptions);
    };

    const removeOption = index => {
        console.log(options.length)
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    }


    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].optionText = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.optionText}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                value={opt.mark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].mark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    <Checkbox
                        status={opt.isCorrect ? 'checked' : 'unchecked'}
                        onPress={() => toggleCorrect(idx)}
                        color="green"
                    />

                    {/** after click add it need to auto focus the next added input box */}



                    <Pressable style={styles.icons} onPress={() => insertOption(idx)}>
                        <Ionicons name="add" size={20} color={Colors.secondaryColor} />
                    </Pressable>

                    <Pressable style={styles.icons} onPress={() => removeOption(idx)}>
                        <Ionicons name="close" size={20} color="red" />
                    </Pressable>

                </View>
            ))}

            {
                options.length == 0 ? (
                    <Pressable style={styles.icons} onPress={addOption}>
                        <Text style={styles.addNewOption}>Add Option</Text>
                    </Pressable>
                ) : null
            }
        </View>
    );
};

const BooleanComponent = ({ giveOptionMarks , options ,setOptions  }) => {
    useEffect(() => {
        setOptions([
            { optionText: '', isCorrect: false , mark : '' },
            { optionText: '', isCorrect: false ,  mark : '' },
        ]);
    },[]);

    const setCorrect = index => {
        const newOptions = options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === index,
        }));
        setOptions(newOptions);
    };

    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].optionText = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.optionText}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />

                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                value={opt.mark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].mark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    <Checkbox
                        status={opt.isCorrect ? 'checked' : 'unchecked'}
                        onPress={() => setCorrect(idx)}
                        color="green"
                    />
                </View>
            ))}
        </View>
    );
};


const FillBlankComponent = ({ giveOptionMarks ,options ,setOptions  }) => {
    const [answers, setAnswers] = useState(['']);

    const updateAnswer = (index, text) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    return (
        <View>
            {answers.map((ans, idx) => (
                <TextInput
                    key={idx}
                    placeholder={`Answer ${idx + 1}`}
                    value={ans}
                    onChangeText={text => updateAnswer(idx, text)}
                    style={styles.input}
                />
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    addButton: {
        padding: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    booleanText: {
        flex: 1,
        fontSize: 16,
    },
    icons: {
        padding: 5,
        borderRadius: 5,
        marginHorizontal: 2,
        alignItems: 'center',
    },
    addNewOption: {
        padding: 10,
        backgroundColor: Colors.primaryColor,
        color: Colors.white,
        borderRadius: 5,
        marginTop: 10,
        textAlign: 'center',
    }
});

export { MCQComponent, SingleComponent, BooleanComponent, FillBlankComponent };
