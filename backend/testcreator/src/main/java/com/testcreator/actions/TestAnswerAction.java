package com.testcreator.actions;

import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.testcreator.dto.ApiError;
import com.testcreator.dto.SuccessDto;
import com.testcreator.dto.student.QuestionAnswerDto;
import com.testcreator.dto.student.TestOptionDto;
import com.testcreator.exception.AttemptExpiredException;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
import com.testcreator.model.Question;
import com.testcreator.model.QuestionAnswer;
import com.testcreator.service.AccessService;
import com.testcreator.service.TimedTestService;

public class TestAnswerAction extends JsonApiAction implements ServletRequestAware {
	private List<QuestionAnswerDto> answers;
	private HttpServletRequest request;
	private SuccessDto successDto;
	private List<QuestionAnswer> questionAnswers;
	private List<Question> corrected;

	public String submitAnswers() {

		System.out.println("hello");

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int attemptId = (Integer) request.getAttribute("attemptId");
		int testId = (Integer) request.getAttribute("testId");
		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			context.setTestId(testId);
			new AccessService().require(Permission.CLASSROOM_MEMBER, context);
			new AccessService().require(Permission.ATTEMPT_NOT_EXPIRED, context);
			this.questionAnswers = new TimedTestService().submitAnswer(attemptId,testId, answers);
			if(this.questionAnswers != null) {
				this.corrected = new LinkedList<>();
				for(QuestionAnswer qa : this.questionAnswers) {
					this.corrected.add(qa.getQuestion());
				}
			}
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (AttemptExpiredException e) {
			setError(new ApiError("Attempt expired", 403));
			return FORBIDDEN;
		} catch (ClassroomNotNoundException | IllegalArgumentException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;

	}

	public List<QuestionAnswerDto> getAnswers() {
		return answers;
	}

	public void setAnswers(List<QuestionAnswerDto> answers) {
		this.answers = answers;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;

	}

	public SuccessDto getSuccessDto() {
		return successDto;
	}

	public void setSuccessDto(SuccessDto successDto) {
		this.successDto = successDto;
	}

	public List<QuestionAnswer> getQuestionAnswers() {
		return questionAnswers;
	}

	public List<Question> getCorrected() {
		return corrected;
	}
}
