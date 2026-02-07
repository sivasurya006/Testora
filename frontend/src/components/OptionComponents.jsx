import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';


const MCQComponent = () => {
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);

    const addOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    const toggleCorrect = index => {
        const newOptions = [...options];
        newOptions[index].isCorrect = !newOptions[index].isCorrect;
        setOptions(newOptions);
    };

    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.text}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    <Checkbox
                        status={opt.isCorrect ? 'checked' : 'unchecked'}
                        onPress={() => toggleCorrect(idx)}
                        color="green"
                    />
                </View>
            ))}
            <Pressable onPress={addOption} style={styles.addButton}>
                <Text>Add Option</Text>
            </Pressable>
        </View>
    );
};


const SingleComponent = () => {
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);

    const addOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    const setCorrect = index => {
        const newOptions = options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === index,
        }));
        setOptions(newOptions);
    };

    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.text}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    <Checkbox
                        status={opt.isCorrect ? 'checked' : 'unchecked'}
                        onPress={() => setCorrect(idx)}
                        color="green"
                    />
                </View>
            ))}
            <Pressable onPress={addOption} style={styles.addButton}>
                <Text>Add Option</Text>
            </Pressable>
        </View>
    );
};

const BooleanComponent = () => {
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);

    const setCorrect = index => {
        const newOptions = options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === index,
        }));
        setOptions(newOptions);
    };

    const updateText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={styles.optionContainer}>
                    <TextInput
                        placeholder={`Option ${idx + 1}`}
                        value={opt.text}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
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


const FillBlankComponent = () => {
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
});

export { MCQComponent, SingleComponent, BooleanComponent, FillBlankComponent };
