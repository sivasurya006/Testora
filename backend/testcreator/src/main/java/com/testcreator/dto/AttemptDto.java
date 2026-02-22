package com.testcreator.dto;

import com.testcreator.model.AttemptStatus;

public class AttemptDto {
	
	private Integer attemptId;
	private Long startedAt;
	private Long submittedAt;
	private Long timeTaken;
	private Integer marks;
	private AttemptStatus status;
	
	public Integer getAttemptId() {
		return attemptId;
	}
	public void setAttemptId(Integer attemptId) {
		this.attemptId = attemptId;
	}
	public Long getStartedAt() {
		return startedAt;
	}
	public void setStartedAt(Long startedAt) {
		this.startedAt = startedAt;
	}
	public Long getSubmittedAt() {
		return submittedAt;
	}
	public void setSubmittedAt(Long submittedAt) {
		this.submittedAt = submittedAt;
	}
	public Long getTimeTaken() {
		return timeTaken;
	}
	public void setTimeTaken(Long timeTaken) {
		this.timeTaken = timeTaken;
	}
	public Integer getMarks() {
		return marks;
	}
	public void setMarks(Integer marks) {
		this.marks = marks;
	}
	public AttemptStatus getStatus() {
		return status;
	}
	public void setStatus(AttemptStatus status) {
		this.status = status;
	}
	
	
	
}
