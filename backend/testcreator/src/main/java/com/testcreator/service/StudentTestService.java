package com.testcreator.service;

import java.sql.SQLException;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.StudentTestDao;
import com.testcreator.dto.TestDto;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
public class StudentTestService {

	private StudentTestDao StudentTestDao;
	
	public StudentTestService() throws SQLException {
		this.StudentTestDao = new StudentTestDao();
	}

	public TestDto getNewTest(Context context) throws SQLException {
		
		return StudentTestDao.getNewTests(context.getClasssroomId(),context.getUserId());

	}
}
