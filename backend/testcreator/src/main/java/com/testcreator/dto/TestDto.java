package com.testcreator.dto;

import java.util.List;

import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.TestStatus;

public class TestDto {
	
	private int testId;
//	private int creatorId;
	private String creatorName;
	private int classroomId;
	private String classroomName;
	private String testTitle;
	private long createdAt;
	private Boolean timedTest;
	private Integer durationMinutes;
	private TestStatus status;
	private int maximumAttempts;
	private CorrectionMethod correctionMethod;
	private List<QuestionDto> questions;
	private Integer testCount;
	
	
	public Integer getTestCount() {
		return testCount;
	}
	
	public void setTestCount(Integer testCount) {
		this.testCount = testCount;
	}
	
	public List<QuestionDto> getQuestions() {
		return questions;
	}
	
	public void setQuestions(List<QuestionDto> questions) {
		this.questions = questions;
	}
	
	public int getTestId() {
		return testId;
	}
	
	public void setTestId(int testId) {
		this.testId = testId;
	}
	
//	public int getCreatorId() {
//		return creatorId;
//	}
//	public void setCreatorId(int creatorId) {
//		this.creatorId = creatorId;
//	}
	
	public String getCreatorName() {
		return creatorName;
	}
	
	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}
	
	public int getClassroomId() {
		return classroomId;
	}
	
	public void setClassroomId(int classroomId) {
		this.classroomId = classroomId;
	}
	
	public String getClassroomName() {
		return classroomName;
	}
	
	public void setClassroomName(String classroomName) {
		this.classroomName = classroomName;
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
	
	public Boolean getTimedTest() {
		return timedTest;
	}
	
	public void setTimedTest(Boolean isTimedTest) {
		this.timedTest = isTimedTest;
	}
	
	public Integer getDurationMinutes() {
		return durationMinutes;
	}
	
	public void setDurationMinutes(Integer durationMinutes) {
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
	
	public CorrectionMethod getCorrectionMethod() {
		return correctionMethod;
	}
	
	public void setCorrectionMethod(CorrectionMethod correctionMethod) {
		this.correctionMethod = correctionMethod;
	}
	
}

