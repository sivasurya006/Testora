package com.testcreator.interceptors;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;

public class TestIdInterceptor extends AbstractInterceptor {

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		HttpServletRequest request = ServletActionContext.getRequest();
		
		
		String testIdHeader = request.getHeader("X-TestId");
		if(testIdHeader  == null || testIdHeader.isBlank()) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("TestId header not provided", 400));
			}
			
			return Action.INPUT;
		}
		
		
		
		try {
			int testId = Integer.parseInt(testIdHeader);
			request.setAttribute("testId", testId);
			return invocation.invoke();
		}catch (NumberFormatException e) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("invalid test id", 400));
			}
			e.printStackTrace();
		}
		
		return Action.INPUT;
	}

}
