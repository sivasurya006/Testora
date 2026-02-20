package com.testcreator.dto;

import java.util.List;

import com.testcreator.model.Answer;
import com.testcreator.model.Option;
import com.testcreator.model.QuestionType;

public class QuestionReportDto {
	private int id;
	private QuestionType type;
	private int marks;
	private String questionText;
	private List<Option> options;
	private List<Answer> selectedOptions;
	private int givenMarks;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public QuestionType getType() {
		return type;
	}

	public void setType(QuestionType type) {
		this.type = type;
	}

	public int getMarks() {
		return marks;
	}

	public void setMarks(int marks) {
		this.marks = marks;
	}

	public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public List<Option> getOptions() {
		return options;
	}

	public void setOptions(List<Option> options) {
		this.options = options;
	}

	public List<Answer> getSelectedOptions() {
		return selectedOptions;
	}

	public void setSelectedOptions(List<Answer> selectedOptions) {
		this.selectedOptions = selectedOptions;
	}

	public int getGivenMarks() {
		return givenMarks;
	}

	public void setGivenMarks(int givenMarks) {
		this.givenMarks = givenMarks;
	}

}
