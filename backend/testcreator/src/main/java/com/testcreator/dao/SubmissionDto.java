package com.testcreator.dao;

public class SubmissionDto {
	
	private Integer userId;
	private String name;
	private String email;
	private Integer testId;
	private String title;
	private Integer attemptsCount;
	private Integer evaluatedCount;
	private Integer submittedCount;
	
	public Integer getUserId() {
		return userId;
	}
	
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Integer getTestId() {
		return testId;
	}
	public void setTestId(Integer testId) {
		this.testId = testId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public Integer getAttemptsCount() {
		return attemptsCount;
	}
	public void setAttemptsCount(Integer attemptsCount) {
		this.attemptsCount = attemptsCount;
	}
	
	public Integer getEvaluatedCount() {
		return evaluatedCount;
	}

	public void setEvaluatedCount(Integer evaluatedCount) {
		this.evaluatedCount = evaluatedCount;
	}

	public Integer getSubmittedCount() {
		return submittedCount;
	}

	public void setSubmittedCount(Integer submittedCount) {
		this.submittedCount = submittedCount;
	}

	@Override
	public String toString() {
		return "SubmissionDto [userId=" + userId + ", name=" + name + ", email=" + email + ", testId=" + testId
				+ ", title=" + title + ", attemptsCount=" + attemptsCount + "]";
	}
	
	
	
}
