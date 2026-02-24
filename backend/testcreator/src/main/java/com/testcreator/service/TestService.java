package com.testcreator.service;


import java.sql.SQLException;
import java.util.List;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.SubmissionDto;
import com.testcreator.dao.TestDao;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.QuestionReportDto;
import com.testcreator.dto.TestDto;
import com.testcreator.dto.TestReportDto;
import com.testcreator.dto.UserTestAttemptDto;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.Context;
import com.testcreator.model.Option;
import com.testcreator.model.Permission;
import com.testcreator.model.QuestionType;
import com.testcreator.model.TestStatus;
import com.testcreator.model.UserRole;

public class TestService {

	private TestDao testDao;
	private ClassroomUsersDao classroomUsersDao;
	
	public TestService() throws SQLException {
		this.testDao = new TestDao();
		this.classroomUsersDao = new ClassroomUsersDao();
	}
	
	public TestDto createNewTest(Context context,String title) throws SQLException {
		new AccessService().require(Permission.CLASSROOM_TUTOR, context);
		return testDao.createTest(context.getClasssroomId(), context.getUserId(), title);
	}
	
	public boolean publishTest(TestDto testDto) throws SQLException {
		return testDao.publishTest(testDto);
	}
	
	public boolean unPublishTest(int testId) throws SQLException {
		return testDao.unPublishTest(testId);
	}
	
	public List<TestDto> getAllTests(Context context,int limit) throws SQLException{
		new AccessService().require(Permission.CLASSROOM_TUTOR, context);
		return testDao.getAllTests(context.getClasssroomId(),limit);
	}
	
	public boolean deleteTest(int testId) throws SQLException {
		return testDao.deleteTest(testId);
	}
	
	public boolean renameTest(int testId,String newName) throws SQLException {
		return testDao.renameTest(testId, newName);
	}
	
	
	// Fetch all Tests
	public List<TestDto> getAllTests(Context context) throws SQLException{
		return getAllTests(context, -1);
	}
	
	public List<TestDto> getTestsByStatus(Context context,int limit,TestStatus status) throws SQLException{
		new AccessService().require(Permission.CLASSROOM_TUTOR, context);
		return testDao.getTestsByStatus(context.getClasssroomId(), limit, status);
	}
	
	public List<TestDto> getTestsByStatus(Context context,TestStatus status) throws SQLException{
		return getTestsByStatus(context, -1,status);
	}

	public QuestionDto createNewQuestion(Context context,int testId,String questionText,QuestionType type,int marks,List<Option> options) throws SQLException{
		new AccessService().require(Permission.CLASSROOM_TUTOR, context);
		return testDao.createNewQuetion(testId, questionText, type, marks,options);
	}
	
	public QuestionDto getQuestionWithOption(int userId,int classroomId,int questionId) throws SQLException {
		ClassroomUser classroomUser = classroomUsersDao.getUser(classroomId, userId);
		if(classroomUser == null) {
			throw new UnauthorizedException("Classroom members only create questions");
		}
		if(classroomUser.getRole() == UserRole.STUDENT) {
			return testDao.getQuestionBtId(questionId,false);
		}
		return testDao.getQuestionBtId(questionId,true);
	}
	
	public boolean deleteQuestion(Context context,int questionId) throws SQLException {
		return testDao.deleteQuestion(questionId);
	}
	
	
	public boolean deleteOption(int userId,Context context,int optionId) throws SQLException {
		new AccessService().require(Permission.CLASSROOM_TUTOR, context);
		return testDao.deleteOption(optionId);
	}
	
	public boolean updateQuestion(Context context ,QuestionDto questionDto) throws SQLException {
		return testDao.updateQuestion(questionDto);
	}
	
	public TestDto getAllTestQuestion(int userId, int classroomId , int testId) throws SQLException {
		ClassroomUser classroomUser = classroomUsersDao.getUser(classroomId, userId);
		if(classroomUser == null) {
			throw new UnauthorizedException("Classroom members only create questions");
		}
		
		if(classroomUser.getRole() == UserRole.STUDENT) {
			return testDao.getTestQuestions(testId,false);
		}
		
		return testDao.getTestQuestions(testId,true);
	}
	
	public TestDto getTestCount(int classroomId) throws SQLException {
			return testDao.getTestCount(classroomId);
		
	
	}
	
	public List<TestDto> getDashbordAnaliticsData(int classroomId) {
		return testDao.getDashboardAnaliticsData(classroomId);
	}
	
	public List<TestDto> getTopPerformingData(int classroomId){
		return testDao.getTopPerformingData(classroomId);
	}
	
	public List<SubmissionDto> getSumittedUsers(int classroomId) throws SQLException{
		return testDao.getSubmittedUsers(classroomId);
	}
	
	public List<SubmissionDto> getTestSubmissionDetails(int classroomId,int testId) throws SQLException{
		return testDao.getTestSubmissionDetails(classroomId,testId);
	}
	
	public UserTestAttemptDto  getUserTestAttempts(int testId,int userId) throws SQLException {
		return testDao.getUserTestAttempts(testId, userId);
	}
	
	public TestReportDto getTetsReport(int attemptId,int testId) throws SQLException {
		return testDao.getTestReport(attemptId, testId);
	}
	
	public TestReportDto getSubmittedAnswerReport(int attemptId,int testId) throws SQLException {
		return testDao.getSubmittedAnswerReport(attemptId, testId);
	}
	
	public boolean gradeAttempt(int attemptId,int totalMarks,List<QuestionReportDto> gradedQuestions) throws SQLException {
		System.out.println("Grading Tests");
		return testDao.updateAnswers(gradedQuestions, totalMarks, attemptId);
	}
	
}
