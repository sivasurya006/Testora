import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import TestHeader from '../../../../../../src/components/testComponents/TestHeader'
import TestFooter from '../../../../../../src/components/testComponents/TestFooter'
import QuestionView from '../../../../../../src/components/testComponents/QuestionView'
import Colors from '../../../../../../styles/Colors'


const data = {
  testDetails: {
    title: "Java Introduction",
    duration: "90",
    totalMarks: 100,
  },
  questions: [
    {
      questionId: 1,
      questionText: "Which of the following best describes Java as a programming language in terms of platform independence, compilation model, and runtime execution in modern software systems?",
      type: "MCQ",
      options: [
        { "optionId": 1, "optionText": "Platform-dependent compiled language" },
        { "optionId": 2, "optionText": "Platform-independent language using JVM" },
        { "optionId": 3, "optionText": "Low-level hardware language" }
      ]
    },
    {
      questionId: 2,
      questionText: "JavaScript is widely used in modern applications — which option best explains its core purpose and execution environment in web and mobile ecosystems?",
      type: "SINGLE",
      options: [
        { "optionId": 4, "optionText": "Server-only scripting language" },
        { "optionId": 5, "optionText": "Client and server-side programming language" },
        { "optionId": 6, "optionText": "Operating system language" }
      ]
    },
    {
      questionId: 3,
      questionText: "Linux is commonly used in servers, cloud platforms, and embedded systems — which description correctly defines Linux in modern computing?",
      type: "SINGLE",
      options: [
        { "optionId": 7, "optionText": "Application software" },
        { "optionId": 8, "optionText": "Operating system kernel" },
        { "optionId": 9, "optionText": "Programming framework" }
      ]
    },
    {
      questionId: 4,
      questionText: "Which option best explains the role of a database management system (DBMS) in large-scale enterprise applications?",
      type: "MCQ",
      options: [
        { "optionId": 10, "optionText": "Stores UI components" },
        { "optionId": 11, "optionText": "Manages structured data storage and retrieval" },
        { "optionId": 12, "optionText": "Handles network routing" }
      ]
    },
    {
      questionId: 5,
      questionText: "In a client-server architecture, what is the primary responsibility of the server component within distributed systems?",
      type: "SINGLE",
      options: [
        { "optionId": 13, "optionText": "UI rendering only" },
        { "optionId": 14, "optionText": "Data processing and service handling" },
        { "optionId": 15, "optionText": "Hardware control" }
      ]
    },
    {
      questionId: 6,
      questionText: "Which description best defines cloud computing in the context of scalability, availability, and on-demand resource allocation?",
      type: "MCQ",
      options: [
        { "optionId": 16, "optionText": "Local device computing model" },
        { "optionId": 17, "optionText": "On-demand internet-based computing services" },
        { "optionId": 18, "optionText": "Offline storage system" }
      ]
    },
    {
      questionId: 7,
      questionText: "What best describes REST APIs in modern web and mobile application architectures?",
      type: "SINGLE",
      options: [
        { "optionId": 19, "optionText": "UI design pattern" },
        { "optionId": 20, "optionText": "Stateless communication interface over HTTP" },
        { "optionId": 21, "optionText": "Database schema format" }
      ]
    },
    {
      questionId: 8,
      questionText: "Which option correctly explains authentication in digital systems with respect to identity verification and access control?",
      type: "MCQ",
      options: [
        { "optionId": 22, "optionText": "Data compression process" },
        { "optionId": 23, "optionText": "User identity verification mechanism" },
        { "optionId": 24, "optionText": "UI navigation logic" }
      ]
    },
    {
      questionId: 9,
      questionText: "What is the main purpose of encryption in secure application development and data transmission systems?",
      type: "SINGLE",
      options: [
        { "optionId": 25, "optionText": "Increase processing speed" },
        { "optionId": 26, "optionText": "Protect data confidentiality" },
        { "optionId": 27, "optionText": "Improve UI performance" }
      ]
    },
    {
      questionId: 10,
      questionText: "Which statement best describes microservices architecture in large-scale distributed software systems?",
      type: "MCQ",
      options: [
        { "optionId": 28, "optionText": "Single monolithic application design" },
        { "optionId": 29, "optionText": "Independent services communicating via APIs" },
        { "optionId": 30, "optionText": "Desktop-only software model" }
      ]
    }
  ]

}

export default function Test() {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});



  const currentQuestion = data.questions[currentIndex];
  const havePrevious = currentIndex > 0;
  const haveNext = currentIndex < data.questions.length - 1;

  console.log(currentQuestion)

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
      <TestHeader data={data.testDetails} />
      <View style={{ maxWidth: 380, width: '100%', height: 13, borderRadius: 30, backgroundColor: '#ddd', margin: 'auto', marginTop: 40 }}>
        <View style={{
          width: ((currentIndex + 1) / data.questions.length) * 380,
          borderRadius: 30, height: '100%', backgroundColor: Colors.primaryColor
        }} >
        </View>
      </View>
      <Text style={styles.quesNumber} >{currentIndex + 1}{' / '}{data.questions.length}</Text>
      <View style={styles.content}>
        <QuestionView question={currentQuestion} />
      </View>
      <TestFooter havePrevious={havePrevious} haveNext={haveNext} onNext={nextQuestion} onPrevious={previousQuestion} />
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