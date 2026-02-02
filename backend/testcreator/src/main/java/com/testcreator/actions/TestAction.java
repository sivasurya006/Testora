package com.testcreator.actions;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Test;
import com.testcreator.service.TestService;

public class TestAction extends JsonApiAction implements ServletRequestAware{
	
	private TestDto testDto;
	private HttpServletRequest request;
	private String testTitle;

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

	
	public TestDto getTestDto() {
		return testDto;
	}
	
	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	@Override
	public Test getModel() {
		return test;
	}
}
