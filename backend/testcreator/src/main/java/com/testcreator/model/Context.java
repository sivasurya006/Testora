package com.testcreator.model;

public class Context {

	private int classsroomId;
	private int userId;
	private int testId;
	private int maximumTestAttempts;
	private int userTestAttempts;
	
	public int getClasssroomId() {
		return classsroomId;
	}
	
	public void setClasssroomId(int classsroomId) {
		this.classsroomId = classsroomId;
	}
	public int getUserId() {
		return userId;
	}
	
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getTestId() {
		return testId;
	}
	public void setTestId(int testId) {
		this.testId = testId;
	}

	public int getMaximumTestAttempts() {
		return maximumTestAttempts;
	}

	public void setMaximumTestAttempts(int maximumTestAttempts) {
		this.maximumTestAttempts = maximumTestAttempts;
	}

	public int getUserTestAttempts() {
		return userTestAttempts;
	}

	public void setUserTestAttempts(int userTestAttempts) {
		this.userTestAttempts = userTestAttempts;
	}

	@Override
	public String toString() {
		return "Context [classsroomId=" + classsroomId + ", userId=" + userId + ", testId=" + testId
				+ ", maximumTestAttempts=" + maximumTestAttempts + ", userTestAttempts=" + userTestAttempts + "]";
	}
	

	
}
