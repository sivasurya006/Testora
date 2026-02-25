import { View, Text, StyleSheet, Platform, Dimensions, ScrollView, Modal } from 'react-native'
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
import FillInBlankQuestionView from '../../../../../../src/components/testComponents/FillInBlankQuestionView'
import MatchingQuestionView from '../../../../../../src/components/testComponents/MatchingQuestionView'
import DetailedTestReport from '../../../../../../src/components/DetailedTestReport'

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
  const [reportData, setReportData] = useState([]);
  const [submittedConfirmModalVisible, setSubmittedConfirmModalVisible] = useState(false);
  const [tabWarningVisible, setTabWarningVisible] = useState(false);
  const [fullScreenExitWarning, setFullScreenExitWarning] = useState(false);

  const selectedAnswersRef = useRef(selectedAnswers);
  const fullScreenExitCount = useRef(0);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  const attemptId = useRef(null);

  function onExit() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.log('Exit fullscreen failed:', err);
      });
    }
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

    console.log('Submitting with attemptId:', attemptId.current);
    console.log(testId, classroomId);

    console.log('Selected answers payload:', makePayload(selectedAnswersRef.current));

    try {
      console.log('inside try')
      if (!attemptId.current) throw new Error('Attempt ID not set');
      const result = await api.post('/timedtest/submit',
        makePayload(selectedAnswersRef.current), {
        headers: {
          'X-ClassroomId': classroomId,
          'X-TestId': testId,
          'X-AttemptId': attemptId.current
        }
      });

      if (result.data == null) {
        console.log('No result data received');
        setSubmittedConfirmModalVisible(true)
        return;
      }


      console.log('Submission result: ======================================== ', result.data);

      setTotalMarks(result.data.totalMarks);
      setReportData(result.data);
      setSubmitModalVisible(false);
      setResultPageOpen(true);

    } catch (err) {
      console.log(err);
    }
  }

  function onTimeEnd() {
    setTimesupModalVisible(true);
  }

  function requestFullscreenMode() {
    if (Platform.OS === 'web' && typeof document !== 'undefined' && document.documentElement.requestFullscreen) {

      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Fullscreen request failed:', err);
      }).then(() => {
        setFullScreenExitWarning(false);
      });
    }
  }

  // useEffect(() => {
  //   const detectDevTools = () => {
  //     const threshold = 160;

  //     if (
  //       window.outerWidth - window.innerWidth > threshold ||
  //       window.outerHeight - window.innerHeight > threshold
  //     ) {
  //       setTabWarningVisible(true);
  //       submitAnswer();
  //     }
  //   };

  //   window.addEventListener("resize", detectDevTools);

  //   return () => {
  //     window.removeEventListener("resize", detectDevTools);
  //   };
  // }, []);


  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    // const handleKeyDowns = (e) => {
    //   if (e.key !== 'Escape') return;
    //   if (!document.fullscreenElement) {
    //     fullScreenExitCount.current += 1;
    //     console.log('Escape pressed while not fullscreen, count:', fullScreenExitCount.current);

    //     if (fullScreenExitCount.current === 1) {
    //       shouldAutoFullscreen.current = false;
    //       setFullScreenExitWarning(true);
    //     } else if (fullScreenExitCount.current >= 1) {
    //       submitAnswer();
    //     }
    //   }
    // };
    // document.addEventListener('keydown', handleKeyDowns);


    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    // const handleContextMenu = (e) => {
    //   e.preventDefault();
    // };

    const handleKeyDown = (e) => {
      if (['c', 'v', 'x', 'a', 'i'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    // document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {

        fullScreenExitCount.current += 1;


        if (fullScreenExitCount.current === 1) {
          setFullScreenExitWarning(true);
        }

        if (fullScreenExitCount.current >= 2) {
          submitAnswer();
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const onBlur = () => {
      if (isResultPageOpen) return;
      handleBlur();
    };

    const onFocus = () => {
      if (isResultPageOpen) return;
      handleFocus();
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

  }, []);



  console.log("selectedAnswers out side ", selectedAnswers)


  const hiddenStart = useRef(null);
  const tabSwitchCount = useRef(0);
  const violationPoints = useRef(0);
  // const pageLoaded = useRef(false);
  const handleBlur = () => {
    if (isResultPageOpen) return;

    tabSwitchCount.current += 1;
    console.log("Tab switched:", tabSwitchCount.current);

    if (tabSwitchCount.current === 1) {
      setTabWarningVisible(true);
    }

    if (tabSwitchCount.current >= 2) {
      console.log("Auto submitting due to tab switch");
      submitAnswer();
    }
  };

  const handleFocus = () => {
    console.log("User returned to test");
  };

  const handleVisibilityChange = () => {
    if (isResultPageOpen) return;

    if (document.hidden) {
      console.log("Document hidden");
      handleBlur();
    } else {
      console.log("Document visible");
      handleFocus();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);




  useEffect(() => {
    if (Platform.OS == 'web') return;

    //   const appState = useRef(AppState.currentState);

    //   const handleAppStateChange = (nextAppState) => {
    //     if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
    //       console.log("User left the app");
    //       setTabWarningVisible(true);
    //     }
    //   };

    //   const interval = setInterval(detectDevTools, 1000);

    return () => clearInterval(interval);
  }, []);




  async function startNewTest() {

    console.log("start new test called");
    try {
      console.log('Starting test with classroomId:', classroomId, 'testId:', testId);

      if (!classroomId || !testId) {
        setMessage('Missing classroomId or testId');
        return;
      }

      const result = await api.get('timedtest/start', {
        headers: { 'X-ClassroomId': classroomId, 'X-TestId': testId }
      });
      setData(result.data);
      attemptId.current = result.data.test.attemptId;
      connectWebSocket(result.data.wsUrl + "&testId=" + testId);

      if (Platform.OS === 'web' && typeof document !== 'undefined' && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log('Fullscreen request failed:', err);
        });
      }
    } catch (err) {
      if (err.response?.status === 403) setMessage('Maximum Attempts reached');
      console.log('startNewTest error:', err);
      alert("please allow screen share");
    }
  }


  const wsRef = useRef(null);

  function connectWebSocket(url) {
    if (!url) return;
    const wsUrl = url.replace('localhost', 'localhost');
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

        <View style={[styles.content, (currentQuestion.type != 'FILL_BLANK' && currentQuestion.type != 'MATCHING') ? { width: containerWidth } : { alignItems: 'center', margin: 'auto', width: containerWidth + 150 }]}>
          {
            currentQuestion.type == 'FILL_BLANK' ? (
              <FillInBlankQuestionView question={currentQuestion} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />

            ) : currentQuestion.type == 'MATCHING' ? (
              <MatchingQuestionView question={currentQuestion} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
            ) : (
              <QuestionView selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} question={currentQuestion} />
            )
          }
        </View>
      </ScrollView>

      <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
      <ConfirmModal message={'Submit the answer?'} normal={true} onCancel={() => { setSubmitModalVisible(false) }} visible={submitModalVisible} onConfirm={submitAnswer} />
      <ConfirmModal message={"Times up!\nYour answers submitted."} confirmOnly={true} onConfirm={onExit} visible={timesupModalVisible} normal={true} />
      <DetailedTestReport totalMarks={totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen} questions={reportData.questions} />
      <ConfirmModal message={"Your answers submitted successfully."} confirmOnly={true} onConfirm={() => { setSubmittedConfirmModalVisible(false); onExit() }} visible={submittedConfirmModalVisible} normal={true} />
      <ConfirmModal message={"tab warning"} confirmOnly={true} onConfirm={() => { setTabWarningVisible(false) }} visible={tabWarningVisible} normal={true} />
      <ConfirmModal message={"full screen exit warning"} confirmOnly={true} onConfirm={() => { setFullScreenExitWarning(false); requestFullscreenMode(); }} visible={fullScreenExitWarning} normal={true} />

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

    console.log(input)

    payload.answers.push({
      questionId: parseInt(key),
      options: Array.isArray(value) ? value : [value]

    });
  });
  return payload;
}