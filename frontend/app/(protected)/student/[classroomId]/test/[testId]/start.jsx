import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import TestFooter from '../../../../../../src/components/testComponents/TestFooter'
import QuestionView from '../../../../../../src/components/testComponents/QuestionView'
import Colors from '../../../../../../styles/Colors'
import api from '../../../../../../util/api'
import { error } from 'console'
import { router, useGlobalSearchParams } from 'expo-router'
import ConfirmModal from '../../../../../../src/components/modals/ConfirmModal'


export default function Test() {

  const { classroomId, testId } = useGlobalSearchParams();

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [message, setMessage] = useState("Loading....");
  const [submitModalVisible,setSubmitModalVisible] = useState(false);
  const [timesupModalVisible,setTimesupModalVisible] = useState(false);

  console.log(selectedAnswers)
  console.log(data)

  const attemptId = useRef(null);

  function onExit() {
    router.replace('/student/' + classroomId + '/tests');
  }

  async function onSubmit() {
    setSubmitModalVisible(true)
  }

  async function submitAnswer() {
    try {
      if (!attemptId) throw new Error('attempt id not set');

      console.log("attemptId ", attemptId)

      const result = await api.post('/timedtest/submit', makePayload(selectedAnswers), {
        headers: {
          'X-ClassroomId': classroomId,
          'X-TestId': testId,
          'X-AttemptId': attemptId.current
        }
      })
      console.log("RESULT : ", result.data)
    } catch (err) {
      console.log(err)
      console.log(err.response?.data);
    }
  }

  function onTimeEnd(){
    setTimesupModalVisible(true);
  }

  { /* web only */ }
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);





  async function startNewTest() {
    try {
      const result = await api.get('/timedtest/start', {
        headers: {
          'X-ClassroomId': classroomId,
          'X-TestId': testId
        }
      })
      setData(result.data)
      attemptId.current = result.data.test.attemptId;
      connectWebSocket(result.data.wsUrl + "&testId=" + testId)
      console.log(result.data)
    } catch (err) {
      if (err.response?.status == 403) {
        setMessage('Maximum Attempts reached');
      }
      console.log(err);
    }
  }

  const wsRef = useRef(null);

  function connectWebSocket(url) {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send("hello from client");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event);
      const data = JSON.parse(event.data);
      if (data.type == 'FINISH_TEST') {
        submitAnswer();
        onTimeEnd();
        console.log('answer submitted');
      }
    };

    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;
  }

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    startNewTest();
  }, [classroomId, testId])

  if (!data || !data.test) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>{message}</Text>
  }

  const questions = data.test.questions;
  const currentQuestion = questions[currentIndex];
  const havePrevious = currentIndex > 0;
  const haveNext = currentIndex < questions.length - 1;

  function nextQuestion() {
    if (haveNext) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function previousQuestion() {
    if (havePrevious) {
      setCurrentIndex(currentIndex - 1);
    }
  }


  return (
    <View style={{ flex: 1 }}>
      <TestHeader onTimeEnd={onTimeEnd} onSubmit={onSubmit} onExit={onExit} data={data.test} />
      <View style={{ maxWidth: 380, width: '100%', height: 13, borderRadius: 30, backgroundColor: '#ddd', margin: 'auto', marginTop: 40 }}>
        <View style={{
          width: ((currentIndex + 1) / data.test.questions.length) * 380,
          borderRadius: 30, height: '100%', backgroundColor: Colors.primaryColor
        }} >
        </View>
      </View>
      <Text style={styles.quesNumber} >{currentIndex + 1}{' / '}{data.test.questions.length}</Text>
      <View style={styles.content}>
        <QuestionView selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} question={currentQuestion} />
      </View>
      <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
      <ConfirmModal message={'Submit the answer?'} normal={true} onCancel={() => setSubmitModalVisible(false)} visible={submitModalVisible} onConfirm={submitAnswer} />
      <ConfirmModal message={"Times up!\nYour answers submitted."} confirmOnly={true} onConfirm={onExit} visible={timesupModalVisible} normal={true}/>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
  quesNumber: {
    fontSize: 28,
    textAlign: 'center',
    paddingTop: 15
  }
})

function makePayload(input) {
  let payload = {
    answers: []
  };
  Object.entries(input).map((value) => {
    payload.answers.push({
      "questionId": value[0],
      "options": value[1]
    })
  })
  return payload;
}