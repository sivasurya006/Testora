import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Checkbox, RadioButton } from 'react-native-paper';
import Colors from '../../styles/Colors';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { AppBoldText, AppMediumText, AppRegularText, AppSemiBoldText } from '../../styles/fonts';
import LabeledInput from './LabledInput';


const MCQComponent = ({ giveOptionMarks, options, setOptions, defaultOptions }) => {



    useEffect(() => {
        if (defaultOptions && defaultOptions.length > 0) {
            setOptions(defaultOptions);
        }
        else {
            setOptions([
                { optionId: '', optionText: '', correct: false, optionMark: '' },
                { optionId: '', optionText: '', correct: false, optionMark: '' },
                { optionId: '', optionText: '', correct: false, optionMark: '' },
                { optionId: '', optionText: '', correct: false, optionMark: '' },
            ]);
        }
    }, []);

    const toggleCorrect = index => {
        const newOptions = [...options];
        newOptions[index].correct = !newOptions[index].correct;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { optionText: '', correct: false }]);
    }

    const insertOption = index => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, { optionText: '', correct: false })
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
                        placeholderTextColor={'gray'}
                        value={opt.optionText}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                value={opt.optionMark}
                                placeholderTextColor={'gray'}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].optionMark = Number(text);
                                    console.log("newOptions ", newOptions)
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    <Checkbox
                        status={opt.correct ? 'checked' : 'unchecked'}
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


const SingleComponent = ({ giveOptionMarks, options, setOptions, defaultOptions }) => {
    useEffect(() => {
        if (defaultOptions && defaultOptions.length > 0) {

            console.log('setting default options ', defaultOptions)

            setOptions(defaultOptions);
        } else {
            setOptions([
                { optionId: '', optionText: '', correct: false, optionMark: '' },
                { optionId: '', optionText: '', correct: false, optionMark: '' },
                { optionId: '', optionText: '', correct: false, optionMark: '' },
            ])
        }
    }, []);

    const addOption = () => {
        setOptions([...options, { optionText: '', correct: false }]);
    }

    const toggleCorrect = index => {
        const newOptions = options.map(opt => {
            opt.correct = false
            return opt;
        });
        newOptions[index].correct = !newOptions[index].correct;
        setOptions(newOptions);
    };

    const insertOption = index => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, { optionText: '', correct: false })
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
                        placeholderTextColor={'gray'}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />
                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                placeholderTextColor={'gray'}
                                value={opt.optionMark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].optionMark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    {console.log('option ', opt.optionText, ' correct ', opt.correct)}

                    <Checkbox
                        status={opt.correct ? 'checked' : 'unchecked'}
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

const BooleanComponent = ({ giveOptionMarks, options, setOptions, defaultOptions }) => {
    useEffect(() => {
        if (defaultOptions && defaultOptions.length > 0) {
            setOptions(defaultOptions);
        } else {
            setOptions([
                { optionId: '', optionText: 'True', correct: false, optionMark: '' },
                { optionId: '', optionText: 'False', correct: false, optionMark: '' },
            ]);
        }
    }, []);

    const setCorrect = index => {
        const newOptions = options.map((opt, idx) => ({
            ...opt,
            correct: idx === index,
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
                        placeholderTextColor={'gray'}
                        value={opt.optionText}
                        onChangeText={text => updateText(idx, text)}
                        style={styles.input}
                    />

                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                placeholderTextColor={'gray'}
                                value={opt.optionMark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].optionMark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { width: 80 }]}
                            />
                        ) : null
                    }

                    <Checkbox
                        status={opt.correct ? 'checked' : 'unchecked'}
                        onPress={() => setCorrect(idx)}
                        color="green"
                    />
                </View>
            ))}
        </View>
    );
};


/**
 * 
 *    [
 *      textPart,
 *      {
 *          blankIdx : 0,
 *          blankTxt : "",
 *          blankMark : 0
 *      },
 *      textPart,
 *      {
 *          blankIdx : 1,
 *          blankTxt : "",
 *          blankMark : 1
 *      }
 *    ]
 * 
 */


const FillBlankComponent = ({ giveOptionMarks, textParts, setTextParts, setMakeAllCaseSensitive, makeAllCaseSensitive }) => {


    const updateRadio = useRef(true);

    useEffect(() => {
        setTextParts([
            { type: "text", value: "" },
        ])
    }, [])

    useEffect(() => {
        if(textParts.length == 0) return
        if(!updateRadio.current){
            updateRadio.current = true
            return
        }
        setTextParts(textParts.map(p => {
            p.isCaseSensitive = makeAllCaseSensitive
            return p
        }))
    },[makeAllCaseSensitive])

    const updateTextPart = (idx, text) => {
        const newTextParts = [...textParts]
        newTextParts[idx].value = text
        // setQuestionText(questionText+text)
        setTextParts(newTextParts)
    }

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {
                textParts.map((part, index) => {
                    if (part.type === "text") {
                        return (

                            <PaperTextInput
                                key={index}
                                value={part.value}
                                onChangeText={(text) => updateTextPart(index, text)}
                                style={[{
                                    minWidth: 220,
                                    // width : 220,
                                    flex: 1,
                                    marginHorizontal: 10,
                                    backgroundColor: Colors.white,

                                }]}
                                multiline
                                label={'Text'}
                                mode='outlined'
                                outlineColor={Colors.borderColor}
                            />
                        );
                    }

                    if (part.type === "blank") {
                        return (
                            <>
                                <View
                                    style={
                                        [{
                                            marginHorizontal: 10,
                                            minWidth: 250,
                                            flex: 1,
                                            backgroundColor: Colors.white,
                                            borderTopWidth: 0,
                                            borderLeftWidth: 0,
                                            borderRightWidth: 0,
                                            borderBottomWidth: 2,
                                            borderBottomColor: part.value.length > 0 ? 'green' : '#EE6C6E'
                                        }]}

                                >
                                    <PaperTextInput
                                        key={index}
                                        value={part.value}
                                        onChangeText={(text) => updateTextPart(index, text)}
                                        multiline
                                        label={'Blank ' + part.idx}
                                        mode='outlined'
                                        // outlineColor={Colors.borderColor}
                                        outlineColor={'transparent'}
                                        activeOutlineColor="transparent"
                                        l

                                    />
                                    <View style={{ marginTop: 2, flexDirection: 'row', justifyContent : 'space-between', alignItems: 'center' }} >
                                        <View style={{ marginTop: 2, flexDirection: 'row', alignItems: 'center' }}>
                                            <RadioButton
                                                status={part.isCaseSensitive ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    const newTextParts = [...textParts];
                                                    newTextParts[index].isCaseSensitive = !part.isCaseSensitive;
                                                    if(!part.isCaseSensitive){
                                                        setMakeAllCaseSensitive(false)

                                                        updateRadio.current = !updateRadio.current;
                                                    }
                                                    setTextParts(newTextParts);
                                                }}
                                                color={Colors.primaryColor}
                                            />
                                            <AppMediumText style={{ color: 'gray' }} >isCaseSensitive</AppMediumText>
                                        </View>
                                        {
                                            giveOptionMarks ? (
                                                <View style={{ marginTop: 2, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                                    <AppMediumText style={{ color: 'gray' }} >Marks</AppMediumText>
                                                    <TextInput
                                                        placeholder={`0`}
                                                        inputMode='numeric'
                                                        placeholderTextColor={'gray'}
                                                        value={part.blankMark}
                                                        onChangeText={text => {
                                                            const newTextParts = [...textParts];
                                                            newTextParts[index].blankMark = text;
                                                            setTextParts(newTextParts);
                                                        }}
                                                        style={[styles.input, { maxWidth: 80, height: 20 }]}
                                                    />
                                                </View>
                                            ) : null
                                        }
                                    </View>
                                </View>
                            </>
                        );
                    }
                })}
        </View>
    );



};

//  { optionId: '', optionText: 'True', optionMark: '' , matchingOptionProperties : { match : "" } },

const MatchingComponents = ({ giveOptionMarks, options, setOptions, defaultOptions }) => {

    console.log("default matching options : ", defaultOptions)

    useEffect(() => {
        if (defaultOptions && defaultOptions.length > 0) {
            setOptions(defaultOptions);
        } else {
            setOptions([
                { optionId: '', optionText: '', optionMark: '', matchingOptionProperties: { match: "" } },
                { optionId: '', optionText: '', optionMark: '', matchingOptionProperties: { match: "" } },
            ]);
        }
    }, []);

    const addOption = () => {
        setOptions([...options, { optionId: '', optionText: '', optionMark: '', matchingOptionProperties: { match: "" } }]);
    }

    const updateLeftText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].optionText = text;
        setOptions(newOptions);
    };

    const updateRightText = (index, text) => {
        const newOptions = [...options];
        newOptions[index].matchingOptionProperties.match = text;
        setOptions(newOptions);
    };


    const insertOption = index => {
        const newOptions = [...options];
        newOptions.splice(index + 1, 0, { optionText: '', optionMark: '', matchingOptionProperties: { match: "" } })
        setOptions(newOptions);
    };

    const removeOption = index => {
        console.log(options.length)
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    }

    console.log("Matching options ", options)

    return (
        <View>
            {options.map((opt, idx) => (
                <View key={idx} style={[styles.optionContainer]}>
                    <View style={{ flexDirection: 'row', gap: 20, flex: 1, alignItems: 'center' }}>
                        <PaperTextInput
                            label={`Left pair ${idx + 1}`}
                            value={opt.optionText}
                            onChangeText={text => updateLeftText(idx, text)}
                            // style={styles.input}
                            mode='outlined'
                            style={{ flex: 1, marginBottom: 5 }}
                            outlineColor={Colors.borderColor}
                        />
                        <PaperTextInput
                            label={`Right pair ${idx + 1}`}
                            value={opt.matchingOptionProperties?.match}
                            onChangeText={text => updateRightText(idx, text)}
                            // style={styles.input}
                            mode='outlined'
                            style={{ flex: 1, marginBottom: 5 }}
                            outlineColor={Colors.borderColor}
                        />
                    </View>

                    {
                        giveOptionMarks ? (
                            <TextInput
                                placeholder={`0`}
                                inputMode='numeric'
                                placeholderTextColor={'gray'}
                                value={opt.optionMark}
                                onChangeText={text => {
                                    const newOptions = [...options];
                                    newOptions[idx].optionMark = text;
                                    setOptions(newOptions);
                                }}
                                style={[styles.input, { maxWidth: 80, height: 50, marginLeft: 20 }]}
                            />
                        ) : null
                    }

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

}




const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.borderColor,
        outlineColor: Colors.primaryColor,
        padding: 12,
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
    },
    blankLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.secondaryColor,
        marginBottom: 5,
    },
    blankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    blankContainerNew: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 15,
        gap: 10,
    },
    selectAllCaseSensitiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
    },
    caseSensitiveContainer: {
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
    },
    caseSensitiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 5,
    },
    caseSensitiveInline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 5,
    },
    caseSensitiveLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: Colors.secondaryColor,
        flex: 1,
    },
    caseSensitiveLabelSmall: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.secondaryColor,
        marginRight: 5,
    },
    textPartContainer: {
        gap: 10,
        margin: 5
    }
});

export { MCQComponent, SingleComponent, BooleanComponent, FillBlankComponent, MatchingComponents };
