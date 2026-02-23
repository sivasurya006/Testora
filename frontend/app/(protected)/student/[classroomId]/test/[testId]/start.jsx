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
import MacthcingQuestionView from '../../../../../../src/components/testComponents/MatchingQuestionView'
import MatchingQuestionView from '../../../../../../src/components/testComponents/MatchingQuestionView'
import DetailedTestReport from '../../../../../../src/components/DetailedTestReport'
import { AppState } from "react-native";
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
  const [reportData, setReportData] = useState([])
  const [tabWarningVisible, setTabWarningVisible] = useState(false);
  const [fullScreenExitWarning, setFullScreenExitWarning] = useState(false);
  const [finalSubmittingWarning, setfinalSubmittinWarning] = useState(false);
  const [submittedConfirmModalVisible, setSubmittedConfirmModalVisible] = useState(false);
  const attemptId = useRef(null);
  const shouldAutoFullscreen = useRef(true);
  const fullScreenExitCount = useRef(0);
  function onExit() {
    shouldAutoFullscreen.current = false; // importan

    if (document.fullscreenElement) {
      document.exitFullscreen();
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
    try {
      if (!attemptId.current) throw new Error('Attempt ID not set');
      const result = await api.post('/timedtest/submit', makePayload(selectedAnswers), {
        headers: {
          'X-ClassroomId': classroomId,
          'X-TestId': testId,
          'X-AttemptId': attemptId.current
        }
      });
      if (result.data == null) {
        setSubmittedConfirmModalVisible(true)
        return;
      }
      if (result.data == null) {
        setSubmittedConfirmModalVisible(true)
        return;
      }
      setTotalMarks(result.data.totalMarks);
      setReportData(result.data);
      setSubmitModalVisible(false)
      setResultPageOpen(true)
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
  useEffect(() => {
  const detectDevTools = () => {
    const threshold = 160;

      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        setTabWarningVisible(true);
      }
    };

    window.addEventListener("resize", detectDevTools);

    return () => {
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);


  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (!document.fullscreenElement) {
        fullScreenExitCount.current += 1;
        console.log('Escape pressed while not fullscreen, count:', fullScreenExitCount.current);

        if (fullScreenExitCount.current === 1) {
          shouldAutoFullscreen.current = false;
          setFullScreenExitWarning(true);
        } else if (fullScreenExitCount.current >= 1) {
          submitAnswer();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    startNewTest()
  }, [classroomId, testId]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if ( ['c', 'v', 'x', 'a','i'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        fullScreenExitCount.current += 1;
        console.log('Exited fullscreen, count:', fullScreenExitCount.current);

        if (fullScreenExitCount.current === 1) {
          console.log('First fullscreen exit — showing warning');
          fullScreenExitCount.current += 1; // reset to 1 in case it was incremented by Escape key handler
          shouldAutoFullscreen.current = false;
          setFullScreenExitWarning(true);
        } else if (fullScreenExitCount.current >= 2) {
          console.log('Second fullscreen exit — submitting test');
          submitAnswer();
        }
      } else {
        shouldAutoFullscreen.current = true;
        setFullScreenExitWarning(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const hiddenStart = useRef(null);  /// track the previuos
  const tabSwitchCount = useRef(0);
  const violationPoints = useRef(0);

  const pageLoaded = useRef(false);

  const handleBlur = () => {
    if (!pageLoaded.current) { pageLoaded.current = true; return; }
    hiddenStart.current = Date.now();
    tabSwitchCount.current += 1;
    violationPoints.current += 1;
    console.log('Window blur…');
  };

  const handleFocus = () => {
    if (!hiddenStart.current) return;
    const secondsAway = (Date.now() - hiddenStart.current) / 1000;
    console.log('User returned after', secondsAway, 'seconds');

    if (tabSwitchCount.current > 1) {
      console.log('Tab switch count exceeded 2, auto-submitting test');
      submitAnswer();
    } else if (tabSwitchCount.current >= 1) {
      violationPoints.current += 5;
      setTabWarningVisible(true);
    }

    hiddenStart.current = null;
  };

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

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

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [isResultPageOpen]);



  useEffect(() => {
    if (Platform.OS == 'web') return;
  useEffect(() => {
    if (Platform.OS == 'web') return;

    const appState = useRef(AppState.currentState);

    const handleAppStateChange = (nextAppState) => {
      if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        console.log("User left the app");
        setTabWarningVisible(true);
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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

      // Request fullscreen when test starts (web only)
      if (Platform.OS === 'web' && typeof document !== 'undefined' && document.documentElement.requestFullscreen && shouldAutoFullscreen.current) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log('Fullscreen request failed:', err);
        });
      }
    } catch (err) {
      if (err.response?.status === 403) setMessage('Maximum Attempts reached');
      console.log('startNewTest error:', err);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        alert("Copy/Paste is disabled during the test");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  //   useEffect(() => {
  //   const handleContextMenu = (e) => e.preventDefault();

  //   window.addEventListener("contextmenu", handleContextMenu);
  //   return () => window.removeEventListener("contextmenu", handleContextMenu);
  // }, []);

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
      <ConfirmModal message={'Submit the answer?'} normal={true} onCancel={() => { setSubmitModalVisible(false) }} visible={submitModalVisible} onConfirm={submitAnswer} />
      <ConfirmModal message={"Times up!\nYour answers submitted."} confirmOnly={true} onConfirm={onExit} visible={timesupModalVisible} normal={true} />
      <ConfirmModal message={"Your answers submitted successfully."} confirmOnly={true} onConfirm={() => { setSubmittedConfirmModalVisible(false); onExit() }} visible={submittedConfirmModalVisible} normal={true} />
      <DetailedTestReport totalMarks={totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen} questions={reportData.questions} />
      <ConfirmModal message={"Your answers submitted successfully."} confirmOnly={true} onConfirm={() => { setSubmittedConfirmModalVisible(false); onExit() }} visible={submittedConfirmModalVisible} normal={true} />
      <ConfirmModal
        message={"You exited fullscreen mode.if you do it agin test will be auto submitted."}
        normal={true}
        confirmOnly={true}
        visible={fullScreenExitWarning}
        onConfirm={() => {
          requestFullscreenMode();
        }}
      />
      <ConfirmModal
        message={`tab switch warning if you switch again your test will be submitted automatically`}
        normal={true}
        visible={tabWarningVisible}
        confirmOnly={true}
        onConfirm={() => {
          setTabWarningVisible(false);
          requestFullscreenMode();
        }}
      />

      <ConfirmModal
        message={`you reached your violation limit`}
        normal={true}
        confirmOnly={true}
        visible={finalSubmittingWarning}
        onConfirm={() => {
          setfinalSubmittinWarning(false);
          requestFullscreenMode();
        }}
      />


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