package com.testcreator.actions;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.testcreator.dto.ApiError;
import com.testcreator.dto.SuccessDto;
import com.testcreator.dto.student.StartTestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.MaximumAttemptsException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
import com.testcreator.service.AccessService;
import com.testcreator.service.TestService;
import com.testcreator.service.TimedTestService;

public class TimedTestAction extends JsonApiAction implements ServletRequestAware {

	private StartTestDto startTestDto;
	private HttpServletRequest request;

	public String startTest() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		context.setTestId(testId);

		try {
			TimedTestService service = new TimedTestService();
			
			AccessService accessService = new AccessService();
			
			accessService.require(Permission.PUBLISHED_TEST, context);
			accessService.require(Permission.CLASSROOM_MEMBER, context);
			accessService.require(Permission.ATTEMPTS_REMAINING, context);
			
			startTestDto = service.startTest(userId, testId);
			startTestDto.setWsUrl("wss://testora-backend.onrender.com/ws/timedtest?attemptId="
					+ startTestDto.getTest().getAttemptId());
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		}catch (MaximumAttemptsException e) {
			setError(new ApiError("Maximum attempts reached for this test.", 403));
			return FORBIDDEN;
		} catch (ClassroomNotNoundException | IllegalArgumentException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}catch (Exception e) {
			// TODO: handle exception
		}

		setError(new ApiError("server error", 500));
		return ERROR;

	}

	public StartTestDto getStartTestDto() {
		return startTestDto;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;

	}
}
