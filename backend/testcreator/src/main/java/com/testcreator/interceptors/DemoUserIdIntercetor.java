package com.testcreator.interceptors;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class DemoUserIdIntercetor extends AbstractInterceptor {

	@Override
	public String intercept(ActionInvocation actionInvocation) throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();	
		request.setAttribute("userId", 3);
		return actionInvocation.invoke();
	}

	@Override
	public void destroy() {
		super.destroy();
	}

	@Override
	public void init() {

		super.init();
	}

}
