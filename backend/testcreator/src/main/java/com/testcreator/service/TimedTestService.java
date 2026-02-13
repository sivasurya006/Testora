package com.testcreator.service;

import java.sql.SQLException;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.student.StartTestDto;
import com.testcreator.dto.student.StartTestQuestionsDto;

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
}
