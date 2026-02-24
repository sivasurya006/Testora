package com.testcreator.interceptors;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.ModelDriven;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.util.finder.Test;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;

public class ClassroomIdInterceptor extends AbstractInterceptor{

	
	
	
	
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		
		

		
		HttpServletRequest request = ServletActionContext.getRequest();
		
		String classroomIdHeader = request.getHeader("X-ClassroomId");
		System.out.println(classroomIdHeader);
		if(classroomIdHeader == null || classroomIdHeader.isBlank()) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {

				jsonAction.setError(new ApiError("Classroom header not provided", 400));
			}
			
			return Action.INPUT;
		}
		
		
		
		try {
			int classroomId = Integer.parseInt(classroomIdHeader);
			request.setAttribute("classroomId", classroomId);
    System.out.println("class"+classroomId);
			return invocation.invoke();
		}catch (NumberFormatException e) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("invalid classroom id", 400));
			}
			e.printStackTrace();
		}
		
		return Action.INPUT;
	}
	
}
