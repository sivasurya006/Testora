package com.testcreator.dto;

import com.testcreator.model.QuestionType;
import java.util.List;
import com.testcreator.model.Option;
import com.testcreator.model.OptionProperties;

public class QuestionDto {
	private int id;
	private QuestionType type;
	private int marks;
	private String questionText;
	private List<Option> options;
	private String testTitle;
	private TestDto test;
	
	private List<QuestionReportDto> gradedAnswers;

	
	

	public List<Option> getOptions() {
		return options;
	}
	
	public TestDto getTest() {
		return test;
	}



	public void setTest(TestDto test) {
		this.test = test;
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

	
	

	public List<QuestionReportDto> getGradedAnswers() {
		return gradedAnswers;
	}

	public void setGradedAnswers(List<QuestionReportDto> gradedAnswers) {
		this.gradedAnswers = gradedAnswers;
	}

	@Override
	public String toString() {
		return "QuestionDto [id=" + id + ", type=" + type + ", marks=" + marks + ", questionText=" + questionText
				+ ", options=" + options + ", testTitle=" + testTitle + "]";
	}
	
	
	
}
