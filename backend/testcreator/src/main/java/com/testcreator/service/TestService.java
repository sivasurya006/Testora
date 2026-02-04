package com.testcreator.service;

import java.sql.SQLException;
import java.util.List;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.TestStatus;
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
		}else {
			throw new UnauthorizedException("Classroom members can only create tests");
		}
		return testDto;
	}

	public List<TestDto> getAllTests(int userId,int classroomId,int limit) throws SQLException{
		List<TestDto> allTests=  null;
		ClassroomUser classroomUser = classroomUsersDao.getUser(classroomId, userId);
		if(classroomUser != null) {
			if(classroomUser.getRole() == UserRole.TUTOR) {
				allTests = testDao.getAllTests(classroomId,limit);
			}else {
				throw new UnauthorizedException("tutors only access all tests");
			}
		}else {
			throw new UnauthorizedException("Classroom members can only access tests");
		}
		return allTests;
	}
	
	
	
	// Fetch all Tests
	public List<TestDto> getAllTests(int userId,int classroomId) throws SQLException{
		return getAllTests(userId, classroomId, -1);
	}
	
	
	
	public List<TestDto> getTestsByStatus(int userId,int classroomId,int limit,TestStatus status) throws SQLException{
		List<TestDto> allTests=  null;
		ClassroomUser classroomUser = classroomUsersDao.getUser(classroomId, userId);
		if(classroomUser != null) {
			if(classroomUser.getRole() == UserRole.TUTOR) {
				allTests = testDao.getTestsByStatus(classroomId, limit, status);
			}else {
				throw new UnauthorizedException("tutors only access all tests");
			}
		}else {
			throw new UnauthorizedException("Classroom members can only access tests");
		}
		return allTests;
	}
	
	public List<TestDto> getTestsByStatus(int userId,int classroomId,TestStatus status) throws SQLException{
		return getTestsByStatus(userId, classroomId, -1,status);
	}
	

	
}
