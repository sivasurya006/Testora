package com.testcreator.dto;

<<<<<<< HEAD
import com.testcreator.model.CorrectionMethod;
=======
<<<<<<< HEAD
public class TestDto {

=======
>>>>>>> caf95c280d9e38cf2bbdd82ef61bec727d835b53
import com.testcreator.model.TestStatus;

public class TestDto {
	
	private int testId;
//	private int creatorId;
	private String creatorName;
	private int classroomId;
	private String classroomName;
	private String testTitle;
	private long createdAt;
	private boolean isTimedTest;
	private int durationMinutes;
	private TestStatus status;
	private int maximumAttempts;
	private CorrectionMethod correctionMethod;
	
	
	

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
<<<<<<< HEAD
	public CorrectionMethod getCorrectionMethod() {
		return correctionMethod;
	}
	public void setCorrectionMethod(CorrectionMethod correctionMethod) {
		this.correctionMethod = correctionMethod;
	}
	
	
=======
>>>>>>> 06e32fee8ad72c61396418bc5e175e53a77f0f20
>>>>>>> caf95c280d9e38cf2bbdd82ef61bec727d835b53
}
