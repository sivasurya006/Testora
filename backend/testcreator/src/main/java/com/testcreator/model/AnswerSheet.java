package com.testcreator.model;

import java.util.List;

public class AnswerSheet {
	private Test test;
	private List<Question> questions;
	
	public Test getTest() {
		return test;
	}
	public void setTest(Test test) {
		this.test = test;
	}
	public List<Question> getQuestions() {
		return questions;
	}
	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}
	
}
