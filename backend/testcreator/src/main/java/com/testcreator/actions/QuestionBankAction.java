package com.testcreator.actions;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.interceptor.ServletRequestAware;

import com.google.gson.JsonObject;
import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.QuestionBankDto;
import com.testcreator.dto.QuestionDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.QuestionNotFoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.Option;
import com.testcreator.model.Permission;
import com.testcreator.model.QuestionType;
import com.testcreator.service.AccessService;
import com.testcreator.service.TestService;

public class QuestionBankAction extends JsonApiAction implements ModelDriven<QuestionBankDto>, ServletRequestAware {

	private QuestionBankDto questionBank;
	private HttpServletRequest request;

	public void validateCreateQuestions() {
		System.out.println("validate called");
		for (QuestionDto questionDto : questionBank.getQuestions()) {
			if (questionDto == null || questionDto.getQuestionText() == null
					|| questionDto.getQuestionText().isBlank()) {
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
						System.out.println("seted option properties");
						if (option.getOptionProperties() == null
								|| option.getOptionProperties().getProperties() == null) {
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

		}
		System.out.println("validate ended");
	}

	public String createQuestions() {

		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		int testId = (Integer) request.getAttribute("testId");

		if (questionBank == null || questionBank.getQuestions() == null) {
			setError(new ApiError("Invalid Questions", 400));
			return INPUT;
		}

		try {
			TestService testService = new TestService();
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.questionBank = testService.createAllQuestions(testId, questionBank);
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

	@Override
	public QuestionBankDto getModel() {
		if (questionBank == null) {
			questionBank = new QuestionBankDto();
		}
		return questionBank;
	}

	public QuestionBankDto getQuestionBank() {
		return questionBank;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
