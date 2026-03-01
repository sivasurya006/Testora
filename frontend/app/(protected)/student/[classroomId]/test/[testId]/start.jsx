import { View, Text, StyleSheet, Platform, ScrollView, AppState, Pressable, useWindowDimensions, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import TestFooter from '../../../../../../src/components/testComponents/TestFooter'
import QuestionView from '../../../../../../src/components/testComponents/QuestionView'
import Colors from '../../../../../../styles/Colors'
import api from '../../../../../../util/api'
import { router, useGlobalSearchParams } from 'expo-router'
import ConfirmModal from '../../../../../../src/components/modals/ConfirmModal'
import { ActivityIndicator } from 'react-native-paper'
import FillInBlankQuestionView from '../../../../../../src/components/testComponents/FillInBlankQuestionView'
import MatchingQuestionView from '../../../../../../src/components/testComponents/MatchingQuestionView'
import DetailedTestReport from '../../../../../../src/components/DetailedTestReport'
import AlertModal from '../../../../../../src/components/modals/alert'
import LoadingScreen from '../../../../../../src/components/LoadingScreen'

export default function Test() {
  const { classroomId, testId } = useGlobalSearchParams();
  const { width: screenWidth } = useWindowDimensions();



  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [message, setMessage] = useState("Loading....");
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [timesupModalVisible, setTimesupModalVisible] = useState(false);
  const [totalMarks, setTotalMarks] = useState(0);
  const [isResultPageOpen, setResultPageOpen] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [submittedConfirmModalVisible, setSubmittedConfirmModalVisible] = useState(false);
  const [tabWarningVisible, setTabWarningVisible] = useState(false);
  const [fullScreenExitWarning, setFullScreenExitWarning] = useState(false);
  const [tabWarningBody, setTabWarningBody] = useState("Do not leave the exam screen. Next violation will auto-submit your test.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backConfirmVisible, setBackConfirmVisible] = useState(false);

  const selectedAnswersRef = useRef(selectedAnswers);
  const fullScreenExitCount = useRef(0);
  const violationCount = useRef(0);
  const lastViolationAt = useRef(0);
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  const attemptId = useRef(null);

  function onExit() {
    if (Platform.OS == 'web') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.log('Exit fullscreen failed:', err);
        });
      }
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
    if (isSubmittingRef.current || hasSubmittedRef.current) return;
    isSubmittingRef.current = true;
    setSubmitModalVisible(false);
    setIsSubmitting(true);
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
        hasSubmittedRef.current = true;
        setSubmitModalVisible(false);
        setSubmittedConfirmModalVisible(true);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      setTotalMarks(result.data.totalMarks);
      setReportData(result.data);
      setSubmitModalVisible(false);
      setResultPageOpen(true);
      hasSubmittedRef.current = true;
      isSubmittingRef.current = false;
      setIsSubmitting(false);

    } catch (err) {
      console.log(err);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  async function onTimeEnd() {
    await submitAnswer();
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


  const reportViolation = useCallback((source, forceAutoSubmit = false) => {
    if (isResultPageOpen || hasSubmittedRef.current) return;

    const now = Date.now();
    if (now - lastViolationAt.current < 800) return;
    lastViolationAt.current = now;

    if (forceAutoSubmit) {
      violationCount.current += 1;
      submitAnswer();
      return;
    }

    violationCount.current += 1;
    console.log('Proctor violation:', source, 'count:', violationCount.current);

    if (violationCount.current === 1) {
      setTabWarningBody(
        Platform.OS === 'web'
          ? "You moved away from the test tab. Next violation will auto-submit your test."
          : "You moved away from the test app. Next violation will auto-submit your test."
      );
      setTabWarningVisible(true);
      return;
    }

    submitAnswer();
  }, [isResultPageOpen]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(key)) {
        e.preventDefault();
      }
      if (key === 'f12') e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);

    const handleFullscreenChange = () => {
      if (isResultPageOpen || hasSubmittedRef.current) return;
      if (!document.fullscreenElement) {

        fullScreenExitCount.current += 1;


        if (fullScreenExitCount.current === 1) {
          setFullScreenExitWarning(true);
        }

        if (fullScreenExitCount.current >= 2) {
          reportViolation('fullscreen_exit', true);
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const onBlur = () => reportViolation('window_blur');
    const onVisibilityChange = () => {
      if (document.hidden) reportViolation('document_hidden');
    };

    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
    };
  }, [reportViolation]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const sub = AppState.addEventListener('change', (nextState) => {
      if (isResultPageOpen) return;

      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (previousState === 'active' && (nextState === 'inactive' || nextState === 'background')) {
        reportViolation(`app_${nextState}`);
      }
    });

    return () => {
      sub.remove();
    };
  }, [isResultPageOpen, reportViolation]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const onBackPress = () => {
      if (isResultPageOpen || submittedConfirmModalVisible) return false;
      setBackConfirmVisible(true);
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [isResultPageOpen, submittedConfirmModalVisible]);




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
    } catch (err) {
      if (err.response?.status === 403) setMessage('Maximum Attempts reached');
      console.log('startNewTest error:', err);
    }
  }


  const wsRef = useRef(null);

  function connectWebSocket(url) {
    if (!url) return;
    const wsUrl = url;
    console.log("connecting... ", wsUrl)
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
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
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

  const isWide = Platform.OS === 'web' && screenWidth >= 1100;

  function nextQuestion() {
    if (haveNext)
      setCurrentIndex(currentIndex + 1);
  }
  function previousQuestion() {
    if (havePrevious)
      setCurrentIndex(currentIndex - 1);
  }

  const containerWidth = isWide ? Math.min(840, screenWidth - 360) : Math.min(900, screenWidth - 24);

  const renderQuestionNavigator = () => (
    <>
      {isWide ? (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Questions</Text>
          <ScrollView style={styles.sidebarList} showsVerticalScrollIndicator={false}>
            {questions.map((q, idx) => {
              const qId = q.questionId || q.id || q.questionId;
              const answered = !!selectedAnswers[qId] && (Array.isArray(selectedAnswers[qId]) ? selectedAnswers[qId].length > 0 : Object.keys(selectedAnswers[qId] || {}).length > 0);
              return (
                <Pressable key={idx} style={[styles.sidebarItem, currentIndex === idx && styles.sidebarItemActive]} onPress={() => setCurrentIndex(idx)}>
                  <Text style={[styles.sidebarItemText, currentIndex === idx && styles.sidebarItemTextActive]}>Q{idx + 1}</Text>
                  {answered && <Text style={styles.sidebarCheck}>✓</Text>}
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mobileNavWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mobileNavScroll}
            contentContainerStyle={styles.mobileNavRow}
          >
            {questions.map((q, idx) => {
              const qId = q.questionId || q.id || q.questionId;
              const answered = !!selectedAnswers[qId] && (Array.isArray(selectedAnswers[qId]) ? selectedAnswers[qId].length > 0 : Object.keys(selectedAnswers[qId] || {}).length > 0);
              return (
                <Pressable key={idx} style={[styles.mobileNavItem, currentIndex === idx && styles.mobileNavItemActive]} onPress={() => setCurrentIndex(idx)}>
                  <Text style={[styles.mobileNavText, currentIndex === idx && styles.mobileNavTextActive]}>{idx + 1}</Text>
                  {answered && <Text style={styles.mobileNavCheck}>•</Text>}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.screen}>
      <LoadingScreen visible={isSubmitting} />
      <TestHeader data={data.test} onTimeEnd={onTimeEnd} onSubmit={onSubmit} forceSubmit={submitAnswer} onExit={onExit} />

      <View style={[styles.mainArea, isWide && styles.mainAreaWide]}>
        {isWide && renderQuestionNavigator()}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollArea}
        >
          {!isWide && renderQuestionNavigator()}

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, {
              width: `${((currentIndex + 1) / questions.length) * 100}%`
            }]} />
          </View>

          <Text style={styles.quesNumber}>{currentIndex + 1} / {questions.length}</Text>

          <View style={[styles.content, { width: containerWidth }, (currentQuestion.type == 'FILL_BLANK' || currentQuestion.type == 'MATCHING') && styles.wideQuestionContent]}>
            {currentQuestion.type == 'FILL_BLANK' ? (
              <FillInBlankQuestionView question={currentQuestion} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
            ) : currentQuestion.type == 'MATCHING' ? (
              <MatchingQuestionView question={currentQuestion} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
            ) : (
              <QuestionView selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} question={currentQuestion} />
            )}
          </View>
        </ScrollView>

      </View>

      <View style={[styles.footerWrap, isWide && styles.footerWrapWide]}>
        <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
      </View>
      <ConfirmModal message={'Submit the answer?'} normal={true} onCancel={() => { setSubmitModalVisible(false) }} visible={submitModalVisible} onConfirm={submitAnswer} />
      <ConfirmModal
        message={'Do you want to go back? If you go back, you will lose this attempt.'}
        normal={true}
        visible={backConfirmVisible}
        onCancel={() => setBackConfirmVisible(false)}
        onConfirm={async () => {
          setBackConfirmVisible(false);
          await submitAnswer();
          onExit();
        }}
      />
      <AlertModal header={"Times up!"} body={"Your answers have been submitted automatically."} confirmOnly={true} onConfirm={onExit} visible={timesupModalVisible} normal={true} />
      <DetailedTestReport totalMarks={totalMarks} onExit={onExit} isResultPageOpen={isResultPageOpen} questions={reportData.questions} />
      <ConfirmModal message={"Your answers submitted successfully."} confirmOnly={true} onConfirm={() => { setSubmittedConfirmModalVisible(false); onExit() }} visible={submittedConfirmModalVisible} normal={true} />
      <AlertModal header={"Proctoring warning"} body={tabWarningBody} confirmOnly={true} onConfirm={() => { setTabWarningVisible(false) }} visible={tabWarningVisible} normal={true} />
      <AlertModal header={"Full screen warning"} body={"Full screen is required for this exam. Tap confirm to re-enter full screen. Exiting again will auto-submit your answers."} confirmOnly={true} onConfirm={() => { setFullScreenExitWarning(false); requestFullscreenMode(); }} visible={fullScreenExitWarning} normal={true} />

    </View>
  )

}



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerWrapWide: {
    left: 266,
    right: 12,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wideQuestionContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  quesNumber: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 14,
    color: Colors.secondaryColor,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 20,
    backgroundColor: '#DFE3EA',
    marginBottom: 14,
    width: '100%',
    maxWidth: 520,
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
  mainArea: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  mainAreaWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 14,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 100,
    paddingTop: 8,
  },
  sidebar: {
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    marginBottom: 100,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.secondaryColor,
  },
  sidebarList: {
    width: '100%'
  },
  sidebarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EEF1F5',
  },
  sidebarItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  sidebarItemText: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  sidebarItemTextActive: {
    fontWeight: '700',
  },
  sidebarCheck: {
    color: Colors.green,
    fontWeight: '700'
  },
  mobileNavRow: {
    gap: 8,
    paddingBottom: 8,
    paddingHorizontal: 2,
    minWidth: '100%',
  },
  mobileNavWrap: {
    width: '100%',
    marginBottom: 6,
  },
  mobileNavScroll: {
    width: '100%',
  },
  mobileNavItem: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  mobileNavItemActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  mobileNavText: {
    color: Colors.secondaryColor,
    fontSize: 13,
    fontWeight: '600',
  },
  mobileNavTextActive: {
    color: Colors.primaryColor,
  },
  mobileNavCheck: {
    color: Colors.green,
    fontSize: 12,
    marginTop: -2,
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