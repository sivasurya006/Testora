package com.testcreator.dto;

public class SuccessDto {
	private String message;
	private int statusCode;
	private boolean success;
	
	public SuccessDto(String message, int statusCode, boolean success) {
		this.message = message;
		this.statusCode = statusCode;
		this.success = success;
	}

	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}
	public boolean issuccess() {
		return success;
	}
	public void setsuccess(boolean success) {
		this.success = success;
	}
	
	
	
}
