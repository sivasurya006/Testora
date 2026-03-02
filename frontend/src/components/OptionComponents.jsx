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
        setTextParts(newTextParts)
    }

    return (
        <View style={styles.container}>
            {textParts.map((part, index) => {

                if (part.type === "text") {
                    return (
                        <View key={index} style={styles.card}>
                            <PaperTextInput
                                value={part.value}
                                onChangeText={(text) => updateTextPart(index, text)}
                                multiline
                                label="Text"
                                mode="outlined"
                                outlineColor={Colors.borderColor}
                                style={styles.textInput}
                            />
                        </View>
                    );
                }

                if (part.type === "blank") {
                    const hasValue = part.value?.length > 0;

                    return (
                        <View key={index} style={styles.card}>
                            
                            <PaperTextInput
                                value={part.value}
                                onChangeText={(text) => updateTextPart(index, text)}
                                multiline
                                label={`Blank ${part.idx}`}
                                mode="outlined"
                                outlineColor="transparent"
                                activeOutlineColor="transparent"
                                style={[
                                    styles.blankInput,
                                    {
                                        borderBottomColor: hasValue ? '#22C55E' : '#EF4444'
                                    }
                                ]}
                            />

                            <View style={styles.bottomRow}>

                                {/* Case Sensitive Toggle */}
                                <View style={styles.caseRow}>
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
                                    <AppMediumText style={styles.caseText}>
                                        Case Sensitive
                                    </AppMediumText>
                                </View>

                                {/* Marks */}
                                {giveOptionMarks && (
                                    <View style={styles.marksContainer}>
                                        <AppMediumText style={styles.marksLabel}>
                                            Marks
                                        </AppMediumText>
                                        <TextInput
                                            placeholder="0"
                                            inputMode="numeric"
                                            placeholderTextColor="gray"
                                            value={part.blankMark}
                                            onChangeText={text => {
                                                const newTextParts = [...textParts];
                                                newTextParts[index].blankMark = text;
                                                setTextParts(newTextParts);
                                            }}
                                            style={styles.marksInput}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                }
            })}
        </View>
    );
};
//  { optionId: '', optionText: 'True', optionMark: '' , matchingOptionProperties : { match : "" } },

const MatchingComponents = ({ giveOptionMarks, options, setOptions, defaultOptions }) => {


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
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    }


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
    },
      container: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
        paddingVertical: 8
    },

    card: {
        flex: 1,
        minWidth: 260,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    textInput: {
        backgroundColor: Colors.white,
    },

    blankInput: {
        backgroundColor: Colors.white,
        borderBottomWidth: 2,
        borderRadius: 8,
    },

    bottomRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    caseRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    caseText: {
        color: '#6B7280',
        fontSize: 13,
    },

    marksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    marksLabel: {
        color: '#6B7280',
        fontSize: 13,
    },

    marksInput: {
        width: 50,
        height: 32,
        paddingHorizontal: 6,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 6,
        textAlign: 'center',
        backgroundColor: Colors.white,
    }
});

export { MCQComponent, SingleComponent, BooleanComponent, FillBlankComponent, MatchingComponents };
