package com.testcreator.dto;

public class SuccessDto {
	private String message;
	private int statusCode;
	private boolean sucess;
	
	public SuccessDto(String message, int statusCode, boolean sucess) {
		this.message = message;
		this.statusCode = statusCode;
		this.sucess = sucess;
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
	public boolean isSucess() {
		return sucess;
	}
	public void setSucess(boolean sucess) {
		this.sucess = sucess;
	}
	
	
	
}
