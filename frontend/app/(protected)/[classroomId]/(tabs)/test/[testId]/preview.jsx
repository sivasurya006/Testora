import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../../../../util/api';
import { router, useGlobalSearchParams } from 'expo-router';
import { AppBoldText } from '../../../../../../styles/fonts';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import SingleChoiceQuestion from '../../../../../../src/components/SingleChoiceQuestion';
import McqQuestion from '../../../../../../src/components/McqQuestion';
import BooleanQuestion from '../../../../../../src/components/BooleanQuestion';
import FillInBlankQuestion from '../../../../../../src/components/FillIntheBlankQuestion';
import MatchingQuestion from '../../../../../../src/components/MatchingQuestion';
import Colors from '../../../../../../styles/Colors';

export default function Preview() {

  const { classroomId, testId } = useGlobalSearchParams();
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    if (!testId) return
    const fetchQuestions = async function () {
      const questions = await getAllTestQuestion(classroomId, testId);
      setAllQuestions(questions);
    }
    if (testId) {
      fetchQuestions();
    }
  }, [classroomId, testId]);


  console.log('Preview questions ,', allQuestions)

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.canGoBack() && router.back()} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{
        flex: 1,
        maxWidth: 1200,
        width: '100%',
        boxShadow: Colors.blackBoxShadow,
        marginHorizontal: 10,
        elevation: 6,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
      }}>
        {
          allQuestions?.map((ques, index) => (
            <View key={ques.id} style={{ margin: 20 }}>
              {
                getQuestion(ques, index + 1)
              }
            </View>
          ))
        }
      </ScrollView>
    </View>
  )
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
        padding: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        // marginBottom: 20,
    },

    closeButton: {
        position: 'absolute',
        right: 0,
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
