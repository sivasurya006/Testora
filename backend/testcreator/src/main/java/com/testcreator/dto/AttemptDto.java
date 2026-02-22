package com.testcreator.dto;

import com.testcreator.model.CorrectionStatus;

public class AttemptDto {
	
	private Integer attemptId;
	private Long startedAt;
	private Long submittedOn;
	private Long timeTaken;
	private Integer marks;
	private CorrectionStatus status;
	
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
	public Long getSubmittedOn() {
		return submittedOn;
	}
	public void setSubmittedOn(Long submittedOn) {
		this.submittedOn = submittedOn;
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
	public CorrectionStatus getStatus() {
		return status;
	}
	public void setStatus(CorrectionStatus status) {
		this.status = status;
	}
	
	
	
}
