package com.testcreator.actions;

public class AuthAction {
	
	private boolean status; 
	
	public String isValidToken() {
		this.status = true;
		return "success";
	}

	public boolean isStatus() {
		return status;
	}
	
	
}
