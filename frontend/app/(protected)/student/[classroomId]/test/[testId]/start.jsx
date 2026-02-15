import { View, Text, StyleSheet, Platform, Dimensions, ScrollView , Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import TestFooter from '../../../../../../src/components/testComponents/TestFooter'
import QuestionView from '../../../../../../src/components/testComponents/QuestionView'
import Colors from '../../../../../../styles/Colors'
import api from '../../../../../../util/api'
import { router, useGlobalSearchParams } from 'expo-router'
import ConfirmModal from '../../../../../../src/components/modals/ConfirmModal'
import { ActivityIndicator, Button } from 'react-native-paper'
import { AppBoldText } from '../../../../../../styles/fonts'
import ResultModal from '../../../../../../src/components/ResultModal'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default function Test() {
  const { classroomId, testId } = useGlobalSearchParams();

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [message, setMessage] = useState("Loading....");
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [timesupModalVisible, setTimesupModalVisible] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isResultPageOpen, setResultPageOpen] = useState(false);

  const attemptId = useRef(null);

  function onExit() {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    router.replace('/student/' + classroomId + '/tests');
  }

  async function onSubmit() {
    setSubmitModalVisible(true);
  }

  async function submitAnswer() {
    try {
      if (!attemptId.current) throw new Error('Attempt ID not set');
      const result = await api.post('/timedtest/submit', makePayload(selectedAnswers), {
        headers: {
          'X-ClassroomId': classroomId,
          'X-TestId': testId,
          'X-AttemptId': attemptId.current
        }
      });
      setTotalMarks(result.data.reduce((sum, ques) => sum + ques.marks, 0));
      setSubmitModalVisible(false)
      setResultPageOpen(true)
    } catch (err) {
      console.log(err);
    }
  }

  function onTimeEnd() {
    setTimesupModalVisible(true);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function startNewTest() {
    try {
      const result = await api.get('/timedtest/start', {
        headers: { 'X-ClassroomId': classroomId, 'X-TestId': testId }
      });
      setData(result.data);
      attemptId.current = result.data.test.attemptId;
      connectWebSocket(result.data.wsUrl + "&testId=" + testId);
    } catch (err) {
      if (err.response?.status === 403) setMessage('Maximum Attempts reached');
      console.log(err);
    }
  }

  const wsRef = useRef(null);

  function connectWebSocket(url) {
    if (!url) return;
    const wsUrl = url.replace('localhost', '192.168.20.6');
    console.log(wsUrl)
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => console.log("WebSocket Connected:", wsUrl);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'FINISH_TEST') {
          submitAnswer();
          onTimeEnd();
        }
      };
      ws.onerror = (err) => console.log("WebSocket error:", err);
      ws.onclose = () => console.log("WebSocket closed");

      wsRef.current = ws;
    } catch (err) {
      console.log("WebSocket failed:", err);
    }
  }


  useEffect(() => {
    startNewTest()
  }, [classroomId, testId]);

  if (!data || !data.test) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  const questions = data.test.questions;
  const currentQuestion = questions[currentIndex];
  const havePrevious = currentIndex > 0;
  const haveNext = currentIndex < questions.length - 1;

  function nextQuestion() {
    if (haveNext)
      setCurrentIndex(currentIndex + 1);
  }
  function previousQuestion() {
    if (havePrevious)
      setCurrentIndex(currentIndex - 1);
  }

  const containerWidth = Platform.OS === 'web' ? Math.min(800, windowWidth - 40) : '100%';

  return (
    <View style={styles.screen}>
      <TestHeader data={data.test} onTimeEnd={onTimeEnd} onSubmit={onSubmit} onExit={onExit} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >

        <View style={[styles.progressBarBackground]}>
          <View style={[styles.progressBarFill, {
            width: ((currentIndex + 1) / questions.length) * (480)
          }]}
          />
        </View>

        <Text style={styles.quesNumber}>{currentIndex + 1} / {questions.length}</Text>

        <View style={[styles.content, { width: containerWidth }]}>
          <QuestionView selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} question={currentQuestion} />
        </View>
      </ScrollView>

      <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
      <ConfirmModal message={'Submit the answer?'} normal={true} onCancel={() => setSubmitModalVisible(false)} visible={submitModalVisible} onConfirm={submitAnswer} />
      <ConfirmModal message={"Times up!\nYour answers submitted."} confirmOnly={true} onConfirm={onExit} visible={timesupModalVisible} normal={true} />
      <ResultModal totalMarks={totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen}/>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgColor,
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  quesNumber: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 15,
  },
  progressBarBackground: {
    height: 13,
    borderRadius: 30,
    backgroundColor: '#ddd',
    margin: 20,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 30,
    backgroundColor: Colors.primaryColor,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.secondaryColor,
  },
})

function makePayload(input) {
  const payload = { answers: [] };
  Object.entries(input).forEach(([key, value]) => {
    payload.answers.push({
      questionId: parseInt(key, 10),
      options: Array.isArray(value) ? value : [value]
    });
  });
  return payload;
}
