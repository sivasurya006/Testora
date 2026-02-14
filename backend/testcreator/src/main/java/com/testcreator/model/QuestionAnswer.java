package com.testcreator.model;

import java.util.List;

public class QuestionAnswer {
	private List<Answer> answer;
	private Question question;

	public QuestionAnswer(List<Answer> answer, Question question) {
		this.answer = answer;
		this.question = question;
	}

	public List<Answer> getAnswer() {
		return answer;
	}
	public void setAnswer(List<Answer> answer) {
		this.answer = answer;
	}
	public Question getQuestion() {
		return question;
	}
	public void setQuestion(Question question) {
		this.question = question;
	}
	
	
}
