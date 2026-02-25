package com.testcreator.model;


public class ClassroomUser {
	private  User user;
	private  Long joinedAt;
	private  UserRole role;
	private Integer classroomId;
	private String topPerformerName;
	private Integer score;

	
	public ClassroomUser(User user, Long joinedAt, UserRole role) {
		this.user = user;
		this.joinedAt = joinedAt;
		this.role = role;

	}
	
	public ClassroomUser(String name,int score) {

		this.topPerformerName=name;
		this.score=score;
		

	}
	
	
	public String getTopPerformerName() {
		return topPerformerName;
	}

	public void setTopPerformerName(String topPerformerName) {
		this.topPerformerName = topPerformerName;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
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
