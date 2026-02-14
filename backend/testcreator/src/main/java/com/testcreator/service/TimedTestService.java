package com.testcreator.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.student.QuestionAnswerDto;
import com.testcreator.dto.student.StartTestDto;
import com.testcreator.dto.student.StartTestQuestionsDto;
import com.testcreator.dto.student.TestOptionDto;
import com.testcreator.model.Answer;
import com.testcreator.model.Question;
import com.testcreator.model.QuestionAnswer;
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
		startTestDto.setTest(testQuestionDto);
		return startTestDto;
	}
	
	public List<QuestionAnswer> submitAnswer(int attemptId,int testId,List<QuestionAnswerDto> answers) throws SQLException {
		 if(!testDao.saveAnswer(attemptId, convertListToMap(answers))) {
			 throw new IllegalArgumentException("Invalid data, submit test");
		 }
		 List<Question> questions = testDao.getQuestions(testId);
		 List<Answer> submitedAnswers = testDao.getAnswers(attemptId);
		 List<QuestionAnswer> questionAnswers  = TestValidator.assignMarksAndCalculate(questions,submitedAnswers);
		 System.out.println(questionAnswers.get(0).getAnswer());
		 if(testDao.updateAnswers(questionAnswers)) {
			 return questionAnswers;
		 }
		 throw new IllegalArgumentException("Invalid data, can't correct");
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
