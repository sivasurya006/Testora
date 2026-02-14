package com.testcreator.model;

import java.sql.Timestamp;

public class Attempt {

    private int attemptId;
    private int testId;
    private int userId;
    private Timestamp startedAt;
    private Timestamp submittedAt;
    private AttemptStatus status;
    private double marks;


    public int getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(int attemptId) {
        this.attemptId = attemptId;
    }

    public int getTestId() {
        return testId;
    }

    public void setTestId(int testId) {
        this.testId = testId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Timestamp getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Timestamp startedAt) {
        this.startedAt = startedAt;
    }

    public Timestamp getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Timestamp submittedAt) {
        this.submittedAt = submittedAt;
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }

    public double getMarks() {
        return marks;
    }

    public void setMarks(double marks) {
        this.marks = marks;
    }

	@Override
	public String toString() {
		return "Attempt [attemptId=" + attemptId + ", testId=" + testId + ", userId=" + userId + ", startedAt="
				+ startedAt + ", submittedAt=" + submittedAt + ", status=" + status + ", marks=" + marks + "]";
	}
    
    
}
