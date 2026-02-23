package com.testcreator.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.TestDto;
import com.testcreator.dto.TestReportDto;
import com.testcreator.dto.student.QuestionAnswerDto;
import com.testcreator.dto.student.StartTestDto;
import com.testcreator.dto.student.StartTestQuestionsDto;
import com.testcreator.dto.student.TestOptionDto;
import com.testcreator.dto.student.TestQuestionDto;
import com.testcreator.model.Answer;
import com.testcreator.model.AnswerSheet;
import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.MatchingOptionProperties;
import com.testcreator.model.QuestionType;
import com.testcreator.util.TestValidator;

public class TimedTestService {
	private TestDao testDao;
	private ClassroomUsersDao classroomUsersDao;
	
	public TimedTestService() throws SQLException {
		this.testDao = new TestDao();
		this.classroomUsersDao = new ClassroomUsersDao();
	}
	
	public StartTestDto startTest(int userId, int testId) throws SQLException {
		
		
		
		StartTestDto startTestDto = new StartTestDto();
		StartTestQuestionsDto testQuestionDto = testDao.startTest(userId, testId);
		if(testQuestionDto == null) {
			
			throw new IllegalArgumentException("Invalid data, can't start Test");
		}
		
		for(TestQuestionDto question  : testQuestionDto.getQuestions()) {
			if(question.getType() == QuestionType.MATCHING) {
				suffleMatches(question.getOptions());
			}
		}
		
		startTestDto.setTest(testQuestionDto);
		return startTestDto;
	}
	
	private void suffleMatches(List<TestOptionDto> options) {
		int size = options.size();
		for(TestOptionDto opt : options) {
			int rand = (int)(Math.random() * size);
			MatchingOptionProperties tempMatch =  opt.getMatchingOptionProperties();
			TestOptionDto tempOption = options.get(rand);
			opt.setMatchingOptionProperties(tempOption.getMatchingOptionProperties());
			tempOption.setMatchingOptionProperties(tempMatch);
		}
	}
	
	public TestReportDto submitAnswer(int attemptId,int testId,List<QuestionAnswerDto> answers) throws SQLException {
		
		System.out.println("saved called ");
		
		if(testDao.saveAnswer(attemptId, convertListToMap(answers))) {
			
			System.out.println("saved succeefully ");
			
			TestDto test =  testDao.getTestById(testId);
			if(test.getCorrectionMethod() == CorrectionMethod.AUTO) {
				TestReportDto testReport = validateTest(attemptId, testId);
				testReport.setTest(test);
				return testReport;
			}
		}
		return null;
	}
	
	private TestReportDto validateTest(int attemptId,int testId) throws SQLException {
		AnswerSheet answerSheet = testDao.getOriginalAnswerSheet(testId);
		List<Answer> answers = testDao.getAnswers(attemptId);
		TestReportDto reportDto  =  TestValidator.assignMarksAndCalculate(answerSheet, answers);
		testDao.updateAnswers(reportDto.getQuestions(),reportDto.getTotalMarks(),attemptId);
		return reportDto;
	}
	
	private Map<String, List<TestOptionDto>> convertListToMap(List<QuestionAnswerDto> list) {
	    Map<String, List<TestOptionDto>> map = new HashMap<>();
	    if(list != null) {
	        for (QuestionAnswerDto q : list) {
	            map.put(String.valueOf(q.getQuestionId()), q.getOptions());
	        }
	    }
	    return map;
	}

	
}
