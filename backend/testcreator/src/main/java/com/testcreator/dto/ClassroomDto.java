package com.testcreator.dto;

public class ClassroomDto {
	private long classroomId;
	private String classroomName;
	private long createdAt;
	private int createdBy;
	private Long joinedAt;
	private String creatorName;
	
	/*
	 * Long Wrapper class => In struts.xml we use excludeNullProperties
	 * Joined At only needed for /api/joined-classrooms
	 * */
	
	public ClassroomDto() {}
	
	
	public ClassroomDto(long classroomId, String classroomName, long createdAt, int createdBy) {
		this.classroomId = classroomId;
		this.classroomName = classroomName;
		this.createdAt = createdAt;
		this.createdBy = createdBy;
	}
	
	
	public long getClassroomId() {
		return classroomId;
	}
	public void setClassroomId(long classroomId) {
		this.classroomId = classroomId;
	}
	public String getClassroomName() {
		return classroomName;
	}
	public void setClassroomName(String classroomName) {
		this.classroomName = classroomName;
	}
	public long getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(long createdAt) {
		this.createdAt = createdAt;
	}
	public int getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(int createdBy) {
		this.createdBy = createdBy;
	}


	public Long getJoinedAt() {
		return joinedAt;
	}


	public void setJoinedAt(long joinedAt) {
		this.joinedAt = joinedAt;
	}
	
	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}
	
	public String getCreatorName() {
		return creatorName;
	}
	
	
	
}
