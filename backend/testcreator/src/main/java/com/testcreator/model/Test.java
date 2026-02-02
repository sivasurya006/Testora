package com.testcreator.model;

public class Test {
	private int testId;
	private int creatorId;
	private int classroomId;
	private String testTitle;
	private long createdAt;
	private boolean isTimedTest;
	private int durationMinutes;
	private TestStatus status;
	private int maximumAttempts;
	
	
	public int getTestId() {
		return testId;
	}
	public void setTestId(int testId) {
		this.testId = testId;
	}
	public int getCreatorId() {
		return creatorId;
	}
	public void setCreatorId(int creatorId) {
		this.creatorId = creatorId;
	}
	public int getClassroomId() {
		return classroomId;
	}
	public void setClassroomId(int classroomId) {
		this.classroomId = classroomId;
	}
	public String getTestTitle() {
		return testTitle;
	}
	public void setTestTitle(String testTitle) {
		this.testTitle = testTitle;
	}
	public long getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(long createdAt) {
		this.createdAt = createdAt;
	}
	public boolean isTimedTest() {
		return isTimedTest;
	}
	public void setTimedTest(boolean isTimedTest) {
		this.isTimedTest = isTimedTest;
	}
	public int getDurationMinutes() {
		return durationMinutes;
	}
	public void setDurationMinutes(int durationMinutes) {
		this.durationMinutes = durationMinutes;
	}
	public TestStatus getStatus() {
		return status;
	}
	public void setStatus(TestStatus status) {
		this.status = status;
	}
	public int getMaximumAttempts() {
		return maximumAttempts;
	}
	public void setMaximumAttempts(int maximumAttempts) {
		this.maximumAttempts = maximumAttempts;
	}
}
