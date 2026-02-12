package com.testcreator.model;


public class ClassroomUser {
	private final User user;
	private final Long joinedAt;
	private final UserRole role;
	private Integer classroomId;
	
	public ClassroomUser(User user, Long joinedAt, UserRole role) {
		this.user = user;
		this.joinedAt = joinedAt;
		this.role = role;
	}
	
	
	
	public Integer getClassroomId() {
		return classroomId;
	}



	public void setClassroomId(Integer classroomId) {
		this.classroomId = classroomId;
	}

	public User getUser() {
		return user;
	}
	public Long getJoinedAt() {
		return joinedAt;
	}

	public UserRole getRole() {
		return role;
	}

}
