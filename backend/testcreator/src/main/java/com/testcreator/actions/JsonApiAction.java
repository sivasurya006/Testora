package com.testcreator.actions;

import com.opensymphony.xwork2.ActionSupport;
import com.testcreator.dto.ApiError;


public class JsonApiAction extends ActionSupport{
	protected ApiError error;
	protected final String NOT_FOUND = "notFound";
	protected final String REDIRECT = "redirect";
	protected final String FORBIDDEN = "forbidden";
		
	
	public ApiError getError() {
		return error;
	}

	public void setError(ApiError error) {
		this.error = error;
	}
	
	
}
