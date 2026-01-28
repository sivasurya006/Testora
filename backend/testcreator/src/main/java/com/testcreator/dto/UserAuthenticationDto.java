package com.testcreator.dto;

public class UserAuthenticationDto {
	private boolean success;
	private String token;
	
	public UserAuthenticationDto(boolean success, String token) {
		this.success = success;
		this.token = token;
	}
	
	public boolean getSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	@Override
	public String toString() {
		return "UserAuthenticationDto [success=" + success + ", token=" + token + "]";
	}

	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	
}
