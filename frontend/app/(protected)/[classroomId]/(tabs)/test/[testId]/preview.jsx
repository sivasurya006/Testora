import { View, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../../../../util/api';
import { router, useGlobalSearchParams } from 'expo-router';
import { AppBoldText } from '../../../../../../styles/fonts';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import SingleChoiceQuestion from '../../../../../../src/components/SingleChoiceQuestion';
import McqQuestion from '../../../../../../src/components/McqQuestion';
import BooleanQuestion from '../../../../../../src/components/BooleanQuestion';
import FillInBlankQuestion from '../../../../../../src/components/FillIntheBlankQuestion';
import MatchingQuestion from '../../../../../../src/components/MatchingQuestion';
import Colors from '../../../../../../styles/Colors';
import { ActivityIndicator } from 'react-native-paper';

export default function Preview() {

    const { classroomId, testId } = useGlobalSearchParams();
    const { width } = useWindowDimensions();
    const [allQuestions, setAllQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = width < 768;
    const isLargeScreen = width >= 1280;
    const contentMaxWidth = isLargeScreen ? 1320 : 1100;
    const horizontalPadding = isMobile ? 10 : isLargeScreen ? 28 : 18;
    const questionGap = isMobile ? 10 : 16;

    useEffect(() => {
        if (!testId) return
        const fetchQuestions = async function () {
            setIsLoading(true);
            const questions = await getAllTestQuestion(classroomId, testId);
            setAllQuestions(questions);
            setIsLoading(false);
        }
        if (testId) {
            fetchQuestions();
        }
    }, [classroomId, testId]);


    return (
        <View style={[styles.container, { paddingHorizontal: horizontalPadding, paddingTop: isMobile ? 10 : 18 }]}>
            <View style={[styles.headerContainer, { maxWidth: contentMaxWidth }]}>
                <TouchableOpacity
                    onPress={() => router.canGoBack() && router.back()}
                    style={styles.closeButton}
                >
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Preview Paper */}
            <View
                style={[
                    styles.previewPaper,
                    {
                        maxWidth: contentMaxWidth,
                        paddingHorizontal: horizontalPadding,
                        paddingTop: isMobile ? 10 : 16,
                        borderRadius: isMobile ? 10 : 14,
                        ...(Platform.OS === 'web' ? { boxShadow: Colors.blackBoxShadow } : {}),
                    }
                ]}
            >

                {isLoading ? (
                    <View style={styles.centerContent}>
                        <ActivityIndicator
                            size="large"
                            color={Colors.primaryColor}
                        />
                    </View>
                ) : allQuestions.length === 0 ? (
                    <View style={styles.centerContent}>
                        <AppBoldText>No Questions Found</AppBoldText>
                    </View>
                ) : (
                    <ScrollView
                        contentContainerStyle={{ paddingTop: 4, paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {allQuestions.map((ques, index) => (
                            <View key={ques.id ?? index} style={{ marginBottom: questionGap }}>
                                {getQuestion(ques, index + 1)}
                            </View>
                        ))}
                    </ScrollView>
                )}

            </View>
        </View>
    );

}



function getQuestion(item, index) {
    switch (item.type) {
        case 'SINGLE':
            return (
                <SingleChoiceQuestion
                    mode="preview"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            );
        case "MCQ":
            return (
                <McqQuestion
                    mode="preview"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        case 'BOOLEAN': {
            return (
                <BooleanQuestion
                    mode="preview"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}

                />
            )
        }
        case "FILL_BLANK": {
            return (
                <FillInBlankQuestion
                    mode="preview"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        }
        case "MATCHING": {
            return (
                <MatchingQuestion
                    mode="preview"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                    selectedOptions={item.selectedOptions}
                />
            )
        }
        default:
            return null;
    }
}



async function getAllTestQuestion(classroomId, testId) {
    try {
        const result = await api.get('/api/tests/getTestQuestions', {
            headers: {
                "X-ClassroomId": classroomId,
                "X-TestId": testId
            }
        });

        if (result?.status == 200 && result.data) {
            console.log("questions fetched successfully");
            return result.data;
        } else {
            console.log("can't fetch questions");
            return [];
        }
    } catch (err) {
        console.log(err);
        return [];
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bgColor,
        flex: 1,
        alignItems: 'center',

    },
    topHeaderText: {
        fontSize: 28,
        textAlign: 'center',
        // margin: 10,
    },
    totalMark: {
        fontSize: 24,
        color: 'black'
    },
    modalContainer: {
        width: 300,
        padding: 20,
        // backgroundColor: '#009B4D',
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    resultContainer: {
        // marginBottom: 20,
    },
    totalMarksText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#28a745',
        fontWeight: 'bold',
    },
    headerContainer: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative',
        marginBottom: 10,
    },

    closeButton: {
        padding: 6,
    },
    statCard: {
        width: 150,
        minHeight: 100,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    statLabel: {
        color: 'white',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },

    statValue: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center',
    },
    reportContainer: {
        flexDirection: 'row',
        backgroundColor: '#F1F3F6',
        borderRadius: 16,
        paddingVertical: 25,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        alignItems: 'center',
        width: '100%',
        maxWidth: 1200,
    },

    reportItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    reportTitle: {
        fontSize: 12,
        letterSpacing: 1,
        color: '#7B8794',
        marginBottom: 8,
    },

    reportNumber: {
        fontSize: 28,
        color: '#1F2933',
    },

    lightText: {
        fontSize: 16,
        color: '#9AA5B1',
    },

    line: {
        width: 1,
        height: '60%',
        backgroundColor: '#D6DDE6',
    },
    previewPaper: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        elevation: 6,
        marginHorizontal: 0,
    },

    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})


// function makeResultToQuestion(result) {
//   return {
//     question: {
//       questionId: result.id,
//       questionText: result.questionText,
//       marks: String(result.marks)
//     },
//     questionType: result.type,
//     options: result.options.map(opt => {
//       const option = {
//         optionId: opt.optionId,
//         optionText: opt.optionText,
//         isCorrect: !!opt.correct,
//         mark: opt.optionMark ? String(opt.optionMark) : ""
//       };
//       if (result.type === "FILL_BLANK" && opt.blankOptionProperties) {
//         option.blankOptionProperties = opt.blankOptionProperties;
//         // console.log("setting option properties ",option)
//       }

//       if (result.type === "MATCHING" && opt.matchingOptionProperties) {
//         option.matchingOptionProperties = opt.matchingOptionProperties;
//         // console.log("setting option properties ",option)
//       }

//       return option;
//     })
//   };
// }
