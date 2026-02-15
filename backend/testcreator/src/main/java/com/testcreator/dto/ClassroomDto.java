package com.testcreator.dto;

public class ClassroomDto {
	private Integer classroomId;
	private String classroomName;
	private Long createdAt;
	private Integer createdBy;
	private Long joinedAt;
	private String creatorName;
	private Integer totalStudents;
	private String code;
	private Integer totalTests;
	private Integer totalAttempted;

	/*
	 * Long Wrapper class => In struts.xml we use excludeNullProperties Joined At
	 * only needed for /api/joined-classrooms
	 */

	public Integer getTotalAttempted() {
		return totalAttempted;
	}

	public void setTotalAttempted(Integer totalAttempted) {
		this.totalAttempted = totalAttempted;
	}

	public Integer getTotalTests() {
		return totalTests;
	}

	public void setTotalTests(Integer totalTests) {
		this.totalTests = totalTests;
	}

	public Integer getTotalStudents() {
		return totalStudents;
	}

	public void setTotalStudents(Integer totalStudents) {
		this.totalStudents = totalStudents;
	}

	public ClassroomDto() {
	}

	public ClassroomDto(Integer classroomId, String classroomName, Long createdAt, Integer createdBy) {
		this.classroomId = classroomId;
		this.classroomName = classroomName;
		this.createdAt = createdAt;
		this.createdBy = createdBy;
	}

	public Integer getClassroomId() {
		return classroomId;
	}

	public void setClassroomId(Integer classroomId) {
		this.classroomId = classroomId;
	}

	public String getClassroomName() {
		return classroomName;
	}

	public void setClassroomName(String classroomName) {
		this.classroomName = classroomName;
	}

	public Long getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Long createdAt) {
		this.createdAt = createdAt;
	}
//	public Integer getCreatedBy() {
//		return createdBy;
//	}

	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}

	public Long getJoinedAt() {
		return joinedAt;
	}

	public void setJoinedAt(Long joinedAt) {
		this.joinedAt = joinedAt;
	}

	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}

	public String getCreatorName() {
		return creatorName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
