package com.testcreator.actions;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.SuccessDto;
import com.testcreator.dto.TestDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.QuestionNotFoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Option;
import com.testcreator.model.TestStatus;
import com.testcreator.service.TestService;

public class TestAction extends JsonApiAction implements ServletRequestAware, ModelDriven<QuestionDto> {

	private TestDto testDto;
	private QuestionDto questionDto = new QuestionDto();
	private SuccessDto successDto;

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
		
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		
		try {
			TestService testService = new TestService();
			this.testDto = testService.createNewTest(context, testTitle);
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
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		try {
			
			TestService testService = new TestService();
			
			if (limit > 0) {
				if (status != null) {
					System.out.println("Status :" + status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(context, limit, testStatus);
					} catch (IllegalArgumentException e) {
						this.allTests = testService.getAllTests(context, limit);
					}
				} else {
					this.allTests = testService.getAllTests(context, limit);
				}
				
			} 
			
			else {
				
				if (status != null) {
					System.out.println("Status :" + status);
					try {
						TestStatus testStatus = TestStatus.valueOf(status.toUpperCase());
						this.allTests = testService.getTestsByStatus(context, testStatus);
					} catch (IllegalArgumentException e) {
						this.allTests = testService.getAllTests(context);
					}
				} else {
					this.allTests = testService.getAllTests(context);
				}
			}
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
		if (questionDto == null || questionDto.getQuestionText() == null || questionDto.getQuestionText().isBlank()) {
			addFieldError("questionText", "Invalid question text");
		}

		if (questionDto.getMarks() < 0) {
			addFieldError("marks", "Invalid question marks");
		}

		if (questionDto.getType() == null) {
			addFieldError("type", "Invalid question type");
		}

		if (questionDto.getOptions() != null) {
			for (Option option : questionDto.getOptions()) {
				if (option.getOptionId() < 0) {
					addFieldError("options.optionId", "Invalid option id");
				}
				if (option.getOptionText() == null || option.getOptionText().isBlank()) {
					addFieldError("options.optionText", "Invalid option text");
				}
				if (option.getOptionMark() < 0) {
					addFieldError("options.optionMark", "Invalid option mark");
				}
			}
		}

		System.out.println("validate ended");
	}

	public String createQuestion() {
		System.out.println("execute called");
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		try {
			TestService testService = new TestService();
			this.questionDto = testService.createNewQuestion(context, testId, questionDto.getQuestionText(),
					questionDto.getType(), questionDto.getMarks(), questionDto.getOptions());
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

	public String fetchQuestionWithOption() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		String questionIdheader = request.getHeader("X-QuestionId");
		if (questionIdheader == null) {
			setError(new ApiError("Question id not provided ", 400));
			return INPUT;
		}

		int questionId = -1;
		try {
			questionId = Integer.parseInt(questionIdheader);
		} catch (NumberFormatException e) {

		}
		if (questionId < 0) {
			setError(new ApiError("Invalid Question Id", 400));
			return INPUT;
		}
		try {
			TestService testService = new TestService();
			this.questionDto = testService.getQuestionWithOption(userId, classroomId,userId);
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
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

	public String deleteQuestion() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		String questionIdheader = request.getHeader("X-QuestionId");
		if (questionIdheader == null) {
			setError(new ApiError("Question id not provided ", 400));
			return INPUT;
		}

		int questionId = -1;
		try {
			questionId = Integer.parseInt(questionIdheader);
		} catch (NumberFormatException e) {

		}
		if (questionId < 0) {
			setError(new ApiError("Invalid Question Id", 400));
			return INPUT;
		}

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			boolean deleted = testService.deleteQuestion(context,questionId);
			if (deleted) {
				this.successDto = new SuccessDto("Question successfully deleted", 200, deleted);
			} else {
				this.successDto = new SuccessDto("Question not deleted", 422, deleted);
			}
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
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

	public String deleteOption() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		String optionIdheader = request.getHeader("X-OptionId");
		if (optionIdheader == null) {
			setError(new ApiError("Option id not provided ", 400));
			return INPUT;
		}

		int optionId = -1;
		try {
			optionId = Integer.parseInt(optionIdheader);
		} catch (NumberFormatException e) {

		}
		if (optionId < 0) {
			setError(new ApiError("Invalid Option Id", 400));
			return INPUT;
		}

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			boolean deleted = testService.deleteOption(userId, context,optionId);
			if (deleted) {
				this.successDto = new SuccessDto("Option successfully deleted", 200, deleted);
			} else {
				this.successDto = new SuccessDto("Option not deleted", 422, deleted);
			}
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
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

	public void validateUpdateQuestion() {
		System.out.println("validate called");
		if (questionDto == null || questionDto.getQuestionText() == null || questionDto.getQuestionText().isBlank()) {
			addFieldError("questionText", "Invalid question text");
		}

		if (questionDto.getMarks() < 0) {
			addFieldError("marks", "Invalid question marks");
		}

		if (questionDto.getType() == null) {
			addFieldError("type", "Invalid question type");
		}

		if (questionDto.getOptions() != null) {
			for (Option option : questionDto.getOptions()) {

				if (option.getOptionId() < 0) {
					addFieldError("options.optionId", "Invalid option id");
				}
				if (option.getOptionText() == null || option.getOptionText().isBlank()) {
					addFieldError("options.optionText", "Invalid option text");
				}
				if (option.getOptionMark() < 0) {
					addFieldError("options.optionMark", "Invalid option mark");
				}
			}
		}

		System.out.println("validate ended");
	}

	public String updateQuestion() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			boolean updated = testService.updateQuestion(context,questionDto);
			if (updated) {
				this.successDto = new SuccessDto("Option successfully updated", 200, updated);
			} else {
				this.successDto = new SuccessDto("Option not updated", 422, updated);
			}
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (ClassroomNotNoundException | QuestionNotFoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		System.out.println("execute ended");
		setError(new ApiError("server error", 500));
		return ERROR;

	}

	public String fetchTestQuestion() {
		System.out.println("execute called");
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");

		try {
			TestService testService = new TestService();
			this.testDto = testService.getAllTestQuestion(userId, classroomId,userId);
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

	public String getTestCount() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		try {
			TestService testService = new TestService();
			this.testDto = testService.getTestCount(userId);
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

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

	public SuccessDto getSuccessDto() {
		return successDto;
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
