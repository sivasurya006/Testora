package com.testcreator.dto;

import com.testcreator.model.QuestionType;
import java.util.List;
import com.testcreator.model.Option;

public class QuestionDto {
	private int id;
	private QuestionType type;
	private int marks;
	private String questionText;
	private List<Option> options;
	private String testTitle;

	public List<Option> getOptions() {
		return options;
	}
	
	

	public String getTestTitle() {
		return testTitle;
	}



	public void setTestTitle(String testTitle) {
		this.testTitle = testTitle;
	}



	public void setOptions(List<Option> options) {
		this.options = options;
	}

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

	@Override
	public String toString() {
		return "QuestionDto [id=" + id + ", type=" + type + ", marks=" + marks + ", questionText=" + questionText
				+ ", options=" + options + "]";
	}

}
