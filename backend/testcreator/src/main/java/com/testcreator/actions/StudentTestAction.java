package com.testcreator.actions;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
import com.testcreator.service.AccessService;
import com.testcreator.service.StudentTestService;
import com.testcreator.service.TestService;

public class StudentTestAction extends JsonApiAction implements ServletRequestAware, ModelDriven<TestDto>{
              
	private TestDto testDto;
	private HttpServletRequest request;


	public String getNewTests() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		
		
		try {
			new AccessService().require(Permission.CLASSROOM_STUDENT, context);

			StudentTestService studentTestService = new StudentTestService();

			this.testDto = studentTestService.getNewTest(context);
			System.out.println(testDto.getTestTitle());
			return SUCCESS;
		} catch (UnauthorizedException e) {
			  e.printStackTrace();

			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
			
		} catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public TestDto getTestDto() {
		return testDto;
	}

	public void setTestDto(TestDto testDto) {
		this.testDto = testDto;
	}

	@Override
	public TestDto getModel() {
		return testDto;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
		
	}
	
	
}

