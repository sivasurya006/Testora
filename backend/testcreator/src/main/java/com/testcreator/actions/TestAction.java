package com.testcreator.actions;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;

import com.google.gson.JsonObject;
import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dao.SubmissionDto;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.SuccessDto;
import com.testcreator.dto.TestDto;
import com.testcreator.dto.UserTestAttemptDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.QuestionNotFoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Option;
import com.testcreator.model.OptionProperties;
import com.testcreator.model.Permission;
import com.testcreator.model.QuestionType;
import com.testcreator.model.TestStatus;
import com.testcreator.service.AccessService;
import com.testcreator.service.TestService;

public class TestAction extends JsonApiAction implements ServletRequestAware, ModelDriven<QuestionDto> {

	private TestDto testDto;
	private QuestionDto questionDto = new QuestionDto();
	private SuccessDto successDto;

	private HttpServletRequest request;
	private int limit;
	private String status;

	private List<TestDto> allTests;
	private List<TestDto> analitics;
	
	private List<SubmissionDto> submittedUsers;
	
	private UserTestAttemptDto userTestAttempt;
	private Integer student;

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
			return;
		}

		QuestionType type = questionDto.getType();
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
				if (type == QuestionType.FILL_BLANK || type == QuestionType.MATCHING) {
					option.setOptionProperties(type);
					if (option.getOptionProperties() == null || option.getOptionProperties().getProperties() == null) {
						addFieldError("options.optionProperties", "Invalid option Properties");
						return;
					} else if (type == QuestionType.FILL_BLANK) {
						JsonObject props = option.getOptionProperties().getProperties();
						if (props.get("blankIdx") == null) {
							addFieldError("options.optionProperties", "Invalid option index");
						}
					} else {
						JsonObject props = option.getOptionProperties().getProperties();
						if (props.get("match").isJsonNull() || props.get("match").toString().isBlank()) {
							addFieldError("options.optionProperties", "Invalid option match");
						}
					}
				}
			}
		}

		if (hasFieldErrors()) {
			System.out.println("fieald errors");
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
			System.out.println(questionDto);
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
			this.questionDto = testService.getQuestionWithOption(userId, classroomId, questionId);
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
			e.printStackTrace();
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
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			boolean deleted = testService.deleteQuestion(context, questionId);
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

	public String deleteTest() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);
		try {
			TestService testService = new TestService();
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			boolean deleted = testService.deleteTest(testId);
			if (deleted) {
				this.successDto = new SuccessDto("Test successfully deleted", 200, deleted);
			} else {
				this.successDto = new SuccessDto("Test not deleted", 422, deleted);
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

		setError(new ApiError("server error", 500));
		return ERROR;

	}

	public String renameTest() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		Context context = new Context();
		context.setClasssroomId(classroomId);
		context.setUserId(userId);

		String newName = questionDto.getTestTitle();

		if (newName == null || newName.isBlank()) {
			setError(new ApiError("Invalid name ", 400));
			return INPUT;
		}

		try {
			TestService testService = new TestService();
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			boolean deleted = testService.renameTest(testId, newName);
			if (deleted) {
				this.successDto = new SuccessDto("Test renamed successfully", 200, deleted);
			} else {
				this.successDto = new SuccessDto("Test not renamed", 422, deleted);
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
			boolean deleted = testService.deleteOption(userId, context, optionId);
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

		System.out.println("Type : " + questionDto.getType());

		if (questionDto == null || questionDto.getQuestionText() == null || questionDto.getQuestionText().isBlank()) {
			addFieldError("questionText", "Invalid question text");
			System.out.println("qu txt error");
		}

		if (questionDto.getId() <= 0) {
			addFieldError("marks", "Invalid question id");
			System.out.println("qu id error");
		}

		if (questionDto.getMarks() < 0) {
			addFieldError("marks", "Invalid question marks");
			System.out.println("qu mark error");
		}

		if (questionDto.getType() == null) {
			addFieldError("type", "Invalid question type");
			System.out.println("qu type error");
		}
		if (questionDto.getOptions() != null) {

			for (Option option : questionDto.getOptions()) {

				option.setOptionProperties(questionDto.getType());

				if (option.getOptionId() < 0) {
					addFieldError("options.optionId", "Invalid option id");
					System.out.println("op id error");
				}
				if (option.getOptionText() == null || option.getOptionText().isBlank()) {
					addFieldError("options.optionText", "Invalid option text");
					System.out.println("op text error");
				}
				if (option.getOptionMark() < 0) {
					addFieldError("options.optionMark", "Invalid option mark");
					System.out.println("op mark error");
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
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			System.out.println("Incomming : " + questionDto);
			boolean updated = testService.updateQuestion(context, questionDto);
			if (updated) {
				this.successDto = new SuccessDto("Question successfully updated", 200, updated);
			} else {
				this.successDto = new SuccessDto("Question not updated", 422, updated);
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
			System.out.println(classroomId + " " + userId + " " + testId);
			this.testDto = testService.getAllTestQuestion(userId, classroomId, testId);
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

	public void validatePublishTest() {
		if (questionDto == null || questionDto.getTest() == null) {
			addFieldError("test", "Invalid test details");
			return;
		}

		this.testDto = questionDto.getTest();
		System.out.println(testDto.getTimedTest());
		if (testDto.getTimedTest() == null || (testDto.getTimedTest() && testDto.getDurationMinutes() <= 0)) {
			addFieldError("test.durationMinutes", "Invalid duration minutes");
			return;
		}

		if (testDto.getMaximumAttempts() < 0) {
			addFieldError("test.maximumAttempts", "Invalid attempts count");
		}

	}

	public String publishTest() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			TestService testService = new TestService();
			testDto.setTestId(testId);
			boolean published = testService.publishTest(testDto);
			if (published) {
				this.successDto = new SuccessDto("Test Published successfully", 200, published);
			} else {
				this.successDto = new SuccessDto("Test not published", 422, published);
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

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public String unPublishTest() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");
		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			TestService testService = new TestService();
			boolean unPublished = testService.unPublishTest(testId);
			if (unPublished) {
				this.successDto = new SuccessDto("Test unPublished successfully", 200, unPublished);
			} else {
				this.successDto = new SuccessDto("Test not unPublished", 422, unPublished);
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

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public String getTestCount() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		try {
			TestService testService = new TestService();
			this.testDto = testService.getTestCount(classroomId);

			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;

	}

	public String getAnalyticsData() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		try {
			TestService testService = new TestService();
			this.analitics = testService.getDashbordAnaliticsData(classroomId);
			System.out.println("Size " + analitics.size());
			return SUCCESS;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ERROR;
	}

	public String getTopPerformingData() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		try {
			TestService testService = new TestService();
			this.analitics = testService.getTopPerformingData(classroomId);
			System.out.println("Size " + analitics.size());
			return SUCCESS;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ERROR;
	}

	public String submittedUsers() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.submittedUsers = testService.getSumittedUsers(classroomId);
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
	
	public String testSubmissionDetails() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.submittedUsers = testService.getTestSubmissionDetails(classroomId,testId);
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
	
	public String userTestAttempt() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");

		
		if(student == null) {
			setError(new ApiError("Invalid student Id",400));
			return INPUT;
		}
		
		
		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.userTestAttempt = testService.getUserTestAttempts(testId, student);
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
	
	
	

	public UserTestAttemptDto getUserTestAttempt() {
		return userTestAttempt;
	}

	public List<TestDto> getAnalitics() {
		return analitics;
	}

	public void setAnalitics(List<TestDto> analitics) {
		this.analitics = analitics;
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

	public List<SubmissionDto> getSubmittedUsers() {
		return submittedUsers;
	}

	public Integer getStudent() {
		return student;
	}

	public void setStudent(Integer student) {
		this.student = student;
	}
	
	

}
