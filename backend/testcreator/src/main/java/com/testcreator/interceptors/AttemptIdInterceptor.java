package com.testcreator.interceptors;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;

public class AttemptIdInterceptor extends AbstractInterceptor {

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		HttpServletRequest request = ServletActionContext.getRequest();
		
		
		String attemptIdHeader = request.getHeader("X-AttemptId");
		if(attemptIdHeader  == null || attemptIdHeader.isBlank()) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("AttemptId header not provided", 400));
			}
			
			return Action.INPUT;
		}
		
		
		
		try {
			int attemptId = Integer.parseInt(attemptIdHeader);
			request.setAttribute("attemptId", attemptId);
			return invocation.invoke();
		}catch (NumberFormatException e) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("invalid AttemptId id", 400));
			}
			e.printStackTrace();
		}
		
		return Action.INPUT;
	}

}
