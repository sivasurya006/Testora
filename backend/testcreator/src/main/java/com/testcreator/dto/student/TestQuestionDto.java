package com.testcreator.dto.student;

import java.util.List;

import com.testcreator.model.QuestionType;

public class TestQuestionDto {
	private Integer questionId;
	private QuestionType type;
	private String questionText;
	private List<TestOptionDto> options;
	
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public QuestionType getType() {
		return type;
	}
	public void setType(QuestionType type) {
		this.type = type;
	}
	public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	public List<TestOptionDto> getOptions() {
		return options;
	}
	public void setOptions(List<TestOptionDto> options) {
		this.options = options;
	}
	
	
}
