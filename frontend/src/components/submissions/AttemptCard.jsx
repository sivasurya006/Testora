import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import Colors from "../../../styles/Colors";
import { AppRegularText, AppSemiBoldText } from "../../../styles/fonts";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import DetailedTestReport from "../DetailedTestReport";
import api from "../../../util/api";
import GradeScreen from "../../screens/GradeScreen";

function getDateTime(seconds) {
    const date = new Date(seconds * 1000);
    const formattedDate = date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
    const formattedTime = date.toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric", hour12: true });
    return { formattedDate, formattedTime };
}



function getTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    return String(hours).padStart(2, '0') + ":" + String(min).padStart(2, '0') + ":" + String(sec).padStart(2, '0');
}

async function getTestReport(classroomId, testId, attemptId) {
    try {
        const result = await api.get(`/api/tests/testReport?attempt=${attemptId}`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId
            }
        });

        if (result.status == 200 && result.data) {
            return result.data
        }

    } catch (err) {
        console.log("can't get report", err.response?.data)
    }

    return [];
}


async function getAnswerSheet(classroomId, testId, attemptId) {
    try {
        const result = await api.get(`/api/tests/answerSheet?attempt=${attemptId}`, {
            headers: {
                'X-ClassroomId': classroomId,
                'X-TestId': testId
            }
        });

        if (result.status == 200 && result.data) {
            return result.data
        }

    } catch (err) {
        console.log("can't get report", err.response?.data)
    }

    return [];
}


export default function AttemptCard({ attempt }) {
    const { width } = useWindowDimensions();
    const isLargeScreen = width > 821;

    const { classroomId , testId } = useGlobalSearchParams();

    const { formattedDate: startedDate, formattedTime: startedTime } = getDateTime(attempt.startedAt);
    const { formattedDate: submittedDate, formattedTime: submittedTime } = getDateTime(attempt.submittedAt)
    const timeTaken = getTime(attempt.timeTaken)
    const [isResultPageOpen, setResultPageOpen] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [answerSheet , setAnswerSheet] = useState([]);
    const [ isGradeScreenOpen , setGradeScreenOpen ] = useState(false);

    function onExit() {
        if (isResultPageOpen) {
            setResultPageOpen(false);
        }
        if(isGradeScreenOpen){
            setGradeScreenOpen(false)
        }
    }

    async function handleShowReport(attemptId) {
        const report = await getTestReport(classroomId, testId, attemptId);
        setReportData(report);
        setResultPageOpen(true)
    }



    async function handleGrade(attemptId) {
        const answer = await getAnswerSheet(classroomId, testId, attemptId);
        setAnswerSheet(answer);
        setGradeScreenOpen(true)
    }




    return (
        <View style={styles.card}>
            <View
                style={[
                    styles.container,
                    isLargeScreen && styles.rowLayout
                ]}
            >

                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <FontAwesome6 name='calendar-check' size={22} />
                    </View>

                    <View>
                        <AppRegularText style={styles.dateText}>{startedDate}</AppRegularText>
                        <AppRegularText style={styles.timeText}>{startedTime}</AppRegularText>
                    </View>
                </View>

                {/* Score + Badge */}
                {/* <View style={styles.scoreSection}>
          <Text style={styles.scoreText}>0 / 0</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>EVALUATED</Text>
          </View>
        </View> */}

                {/* Small screen divider */}
                {!isLargeScreen && <View style={styles.divider} />}

                {/* Bottom Info */}
                <View
                    style={[
                        styles.bottomRow,
                        isLargeScreen && styles.largeBottomRow
                    ]}
                >
                    <View style={!isLargeScreen ? { flexDirection: 'row', justifyContent: 'space-around' } : { flexDirection: 'row', gap: 50 }} >
                        <View style={styles.infoBlock}>
                            <AppRegularText style={styles.label}>Time taken</AppRegularText>
                            <AppRegularText style={styles.value}>{timeTaken}</AppRegularText>
                        </View>

                        <View style={styles.infoBlock}>
                            <AppRegularText style={styles.label}>Submitted</AppRegularText>
                            <AppRegularText style={styles.value}>{submittedTime}</AppRegularText>
                        </View>

                    </View>
                    <TouchableOpacity style={styles.button}

                        onPress={() => {
                            if (attempt.status == 'EVALUATED') {
                                handleShowReport(attempt.attemptId)
                            }else{
                                handleGrade(attempt.attemptId);
                            }
                        }}

                    >
                        <AppSemiBoldText style={styles.buttonText}>{attempt.status == 'EVALUATED' ? "View Report" : "Grade"}</AppSemiBoldText>
                    </TouchableOpacity>
                </View>
            </View>
            <DetailedTestReport totalMarks={reportData.totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen} questions={reportData.questions} />
            <GradeScreen questions={answerSheet.questions} onExit={onExit}  isGradeScreenOpen={isGradeScreenOpen} />
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        margin: 6,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },

    container: {
        // flexDirection: "column",
    },

    rowLayout: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E8F0FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    dateText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
    },

    timeText: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
    },

    scoreSection: {
        alignItems: "flex-end",
        marginTop: 10,
    },

    scoreText: {
        fontSize: 20,
        fontWeight: "600",
        // color: "#1F2937",
    },

    badge: {
        marginTop: 6,
        backgroundColor: Colors.lightBadge,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },

    badgeText: {
        fontSize: 12,
        // fontWeight: "600",
        color: Colors.primaryColor,
    },

    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 16,
    },

    bottomRow: {
        // marginTop: 10,
    },

    largeBottomRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 40,
    },

    infoBlock: {
        // marginBottom: 10,
    },

    label: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "600",
    },

    value: {
        fontSize: 16,
        // fontWeight: "600",
        marginTop: 4,
    },

    button: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: 8,
        // paddingHorizontal: 18,
        borderRadius: 8,
        width: 120
    },

    buttonText: {
        color: Colors.white,
        // fontWeight: "600",
        textAlign: 'center',
    },
});