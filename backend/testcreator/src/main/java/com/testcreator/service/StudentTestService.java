package com.testcreator.service;

import java.sql.SQLException;
import java.util.List;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.StudentTestDao;
import com.testcreator.dto.TestDto;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
public class StudentTestService {
  
	private StudentTestDao StudentTestDao;
    private List<TestDto> tests;
	public StudentTestService() throws SQLException {
		this.StudentTestDao = new StudentTestDao();
	}

	public List<TestDto> getNewTest(Context context) throws SQLException {
		
		return StudentTestDao.getNewTests(context.getClasssroomId(),context.getUserId());

	}
}
