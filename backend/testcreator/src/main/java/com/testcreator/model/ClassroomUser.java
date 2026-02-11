package com.testcreator.model;

import java.time.Instant;

public class ClassroomUser {
	private final User user;
	private final Instant joinedAt;
	private final UserRole role;
	private int classroomId;

	public ClassroomUser(User user, Instant joinedAt, UserRole role) {
		this.user = user;
		this.joinedAt = joinedAt;
		this.role = role;
	}

	public int getClassroomId() {
		return classroomId;
	}

	public void setClassroomId(int classroomId) {
		this.classroomId = classroomId;
	}

	public User getUser() {
		return user;
	}

	public Instant getJoinedAt() {
		return joinedAt;
	}

	public UserRole getRole() {
		return role;
	}

}
