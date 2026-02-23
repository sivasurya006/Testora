package com.testcreator.dto;

import java.util.List;

public class UserTestAttemptDto {
	
	private String userName;
	private String userEmail;
	private List<AttemptDto> attempts;
	
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public List<AttemptDto> getAttempts() {
		return attempts;
	}
	public void setAttempts(List<AttemptDto> attempts) {
		this.attempts = attempts;
	}
}
