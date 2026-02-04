package com.testcreator.actions;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Option;
import com.testcreator.model.Test;
import com.testcreator.model.TestStatus;
import com.testcreator.service.TestService;

public class TestAction extends JsonApiAction implements ServletRequestAware, ModelDriven<QuestionDto>{

	private TestDto testDto;
	private QuestionDto questionDto = new QuestionDto();

	private HttpServletRequest request;
	private int limit;
	private String status;

	private List<TestDto> allTests;


	public String createTest() {
		
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		
		String testTitle = questionDto.getTestTitle();
		
		if (testTitle == null || testTitle.isBlank()) {
			setError(new ApiError("Invalid test title", 400));
			return INPUT;
		}
		try {
			TestService testService = new TestService();
			this.testDto = testService.createNewTest(classroomId, userId, testTitle);
			return SUCCESS;
		} catch (UnauthorizedException e) {
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

	public String fetchCreatedTests() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		try {
			TestService testService = new TestService();
			if (limit > 0) {
				if (status != null) {
					System.out.println("Status :" + status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(userId, classroomId, limit, testStatus);
					} catch (IllegalArgumentException e) {
						this.allTests = testService.getAllTests(userId, classroomId, limit);
					}
				} else {
					this.allTests = testService.getAllTests(userId, classroomId, limit);
				}
			} else {
				if (status != null) {
					System.out.println("Status :" + status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(userId, classroomId, testStatus);
					} catch (IllegalArgumentException e) {
						this.allTests = testService.getAllTests(userId, classroomId);
					}
				} else {
					this.allTests = testService.getAllTests(userId, classroomId);
				}
			}
			System.out.println(allTests);
			return SUCCESS;
		} catch (UnauthorizedException e) {
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
	

    public void validateCreateQuestion() {
        System.out.println("validate called");
        System.out.println(questionDto);
        if (questionDto == null || questionDto.getQuestionText() == null
                || questionDto.getQuestionText().isBlank()) {
            addFieldError("questionText", "Invalid question text");
        }

        if (questionDto.getMarks() < 0) {
            addFieldError("marks", "Invalid question marks");
        }

        if (questionDto.getType() == null) {
            addFieldError("type", "Invalid question type");
        }
        
        System.out.println("validate ended");
    }
    
    
	public String createQuestion() {
		System.out.println("execute called");
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");

		try {
			TestService testService = new TestService();
			this.questionDto = testService.createNewQuestion(userId, classroomId, testId, questionDto.getQuestionText(),
					questionDto.getType(), questionDto.getMarks(),questionDto.getOptions());
			System.out.println("execute success");
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		} catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		System.out.println("execute ended");
		setError(new ApiError("server error", 500));
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

	public QuestionDto getQuestionDto() {
		return questionDto;
	}

	public void setQuestionDto(QuestionDto questionDto) {
		this.questionDto = questionDto;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	@Override
	public QuestionDto getModel() {
		return questionDto;
	}

}
