package com.testcreator.dto.student;

import java.util.List;

public class StartTestQuestionsDto {
	private Integer attemptId;
	private String title;
	private Integer timed;
	private Integer duration;
	private List<TestQuestionDto> questions;
	
	
	public Integer getAttemptId() {
		return attemptId;
	}
	public String getTitle() {
		return title;
	}
	public Integer getTimed() {
		return timed;
	}
	public Integer getDuration() {
		return duration;
	}
	public List<TestQuestionDto> getQuestions() {
		return questions;
	}
	public void setAttemptId(Integer attemptId) {
		this.attemptId = attemptId;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setTimed(Integer timed) {
		this.timed = timed;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	public void setQuestions(List<TestQuestionDto> questions) {
		this.questions = questions;
	}
	
	
	
	
	
	
	
}
