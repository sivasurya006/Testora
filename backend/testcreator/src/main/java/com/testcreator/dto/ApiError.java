package com.testcreator.dto;

public class ApiError {
	private String message;
	private int statusCode;
	private String redirectURI;
	
	public ApiError(String message, int statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
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
	
	public String getRedirectURI() {
		return redirectURI;
	}
	
	public void setRedirectURI(String redirectURI) {
		this.redirectURI = redirectURI;
	}
	
	
}
