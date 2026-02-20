package com.testcreator.model;

import java.util.List;

public class Question {
	
	private String questionText;
	private int questionId;
	private int marks;
	private List<Option> options;
	private QuestionType type;
	
	public QuestionType getType() {
		return type;
	}
	public void setType(QuestionType type) {
		this.type = type;
	}
	public int getQuestionId() {
		return questionId;
	}
	public void setQuestionId(int questionId) {
		this.questionId = questionId;
	}
	public int getMarks() {
		return marks;
	}
	public void setMarks(int d) {
		this.marks = d;
	}
	public List<Option> getOptions() {
		return options;
	}
	public void setOptions(List<Option> options) {
		this.options = options;
	}
	
	public String getQuestionText() {
		return questionText;
	}
	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}
	
	@Override
	public String toString() {
		return "Question [questionText=" + questionText + ", questionId=" + questionId + ", marks=" + marks
				+ ", options=" + options + ", type=" + type + "]";
	}
}
