package com.testcreator.interceptors;

import org.apache.struts2.json.JSONException;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;

public class JsonApiExceptionInterceptor extends AbstractInterceptor  {
	
	@Override
	public String intercept(ActionInvocation actionInvocation) throws Exception {
		
		System.out.println("JsonApiExceptionInterceptor");
		
		try {
			return actionInvocation.invoke();
		}catch (JSONException e) {
			 Object action = actionInvocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("Invalid json format", 400));
			}
		}
		
		return "invalidJson";
	}

}
