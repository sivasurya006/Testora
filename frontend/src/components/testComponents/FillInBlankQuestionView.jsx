import React from "react";
import { TextInput, Text, View } from "react-native";
import { fonts } from "../../../styles/fonts";
// import { View } from "react-native-web";

export default function FillInBlankQuestionView({ question, selectedAnswers, setSelectedAnswers , onNext , onPrevious}) {


    const options = question.options;
    console.log(" options ", options)

    console.log(selectedAnswers)



    /**
     * 
     * optionId
     * 
     */

    const textParts = question.questionText.split("__BLANK__");

    return (
        <View style={{ flexDirection: "row" }}>
            {textParts.map((part, index) => (
                <React.Fragment key={index}>
                    {part !== "" && (
                        <Text style={{
                            // textAlign: 'center',
                            fontSize: 24,
                            // fontFamily: fonts.bold,
                            lineHeight: 62,
                        }}>{part}
                            {index < textParts.length - 1 && (
                                <TextInput
                                    style={{
                                        borderBottomWidth: 2,
                                        minWidth: 60,
                                        marginHorizontal: 4,
                                        outlineWidth: 0,
                                        borderColor: 'green',
                                        fontSize: 20,
                                        paddingHorizontal: 10,
                                        fontFamily: fonts.regular,
                                        marginVertical: 10
                                    }}

                                    value={selectedAnswers[question.questionId]?.[index]?.blankOptionProperties?.blankText || ""}

                                    onChangeText={(txt) => {
                                        options[index].blankOptionProperties = {
                                            blankText: txt,
                                            blankIdx: index + 1
                                        }
                                        setSelectedAnswers({
                                            ...selectedAnswers,
                                            [question.questionId]: options.map((o, idx) => {
                                                if (idx == index) {
                                                    return {
                                                        ...o, blankOptionProperties: {
                                                            blankText: txt,
                                                            blankIdx: index + 1
                                                        }
                                                    }
                                                }
                                                return o;
                                            })

                                        })
                                    }}
                                />
                            )}

                        </Text>
                    )}


                </React.Fragment>
            ))}
        </View>
    );
}
