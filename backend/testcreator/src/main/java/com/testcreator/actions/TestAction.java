package com.testcreator.actions;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Test;
import com.testcreator.model.TestStatus;
import com.testcreator.service.TestService;

public class TestAction extends JsonApiAction implements ServletRequestAware{
	
	private TestDto testDto;
	private HttpServletRequest request;
	private String testTitle;
	private int limit;
	private String status;
	
	private List<TestDto> allTests;

	public void setTestTitle(String testTitle) {
		this.testTitle = testTitle;
	}


	public String createTest() {	
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if( testTitle == null || testTitle.isBlank()) {
			setError(new ApiError("Invalid test title", 400));
			return INPUT;
		}	
		try {
			TestService testService = new TestService();
			this.testDto = testService.createNewTest(classroomId, userId, testTitle);
			return SUCCESS;
		}catch(UnauthorizedException e) {
			setError(new ApiError("Authentication failed",401));
			return LOGIN;
		}catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match",404));
			return NOT_FOUND;
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		
		setError(new ApiError("server error",500));
		return ERROR;
	}
	
	
	public String fetchCreatedTests() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		try {
			TestService testService = new TestService();
			if(limit > 0) {
				if(status != null) {
					System.out.println("Status :"+status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(userId, classroomId,limit,testStatus);
					}
					catch(IllegalArgumentException e) {
						this.allTests = testService.getAllTests(userId, classroomId,limit);
					}
				}else {
					this.allTests = testService.getAllTests(userId, classroomId,limit);
				}
			}else {
				if(status != null) {
					System.out.println("Status :"+status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(userId, classroomId,testStatus);
					}
					catch(IllegalArgumentException e) {
						this.allTests = testService.getAllTests(userId, classroomId);
					}
				}else {
					this.allTests = testService.getAllTests(userId, classroomId);
				}
			}
			System.out.println(allTests);
			return SUCCESS;
		}catch(UnauthorizedException e) {
			setError(new ApiError("Authentication failed",401));
			return LOGIN;
		}catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match",404));
			return NOT_FOUND;
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		
		setError(new ApiError("server error",500));
		return ERROR;
	}

	
	public TestDto getTestDto() {
		return testDto;
	}
	
	public void setLimit(int limit) {
		this.limit = limit;
	}
	
	public List<TestDto> getAllTests() {
		return allTests;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
<<<<<<< HEAD

=======
>>>>>>> ea7601214d1ee30837bdfb5dc38173ea777576cd
}
