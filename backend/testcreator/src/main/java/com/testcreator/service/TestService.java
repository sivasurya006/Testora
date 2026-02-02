package com.testcreator.service;

import java.sql.SQLException;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.UserRole;

public class TestService {

	private TestDao testDao;
	private ClassroomUsersDao classroomUsersDao;
	
	public TestService() throws SQLException {
		this.testDao = new TestDao();
		this.classroomUsersDao = new ClassroomUsersDao();
	}
	
	
	public TestDto createNewTest(int classroomId,int creatorId,String title) throws SQLException {
		TestDto testDto = null;
		ClassroomUser classroomUser = classroomUsersDao.getUser(classroomId, creatorId);
		if(classroomUser != null) {
			if(classroomUser.getRole() == UserRole.TUTOR) {
				testDto = testDao.createTest(classroomId, creatorId, title);
			}else {
				throw new UnauthorizedException("tutors only create classrooms");
			}
		}
		return testDto;
	}
	
}
