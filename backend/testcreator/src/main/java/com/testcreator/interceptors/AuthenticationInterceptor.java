package com.testcreator.interceptors;

import com.opensymphony.xwork2.Action;

import java.util.Arrays;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;
import com.testcreator.util.JwtUtil;

import io.jsonwebtoken.Claims;

public class AuthenticationInterceptor extends AbstractInterceptor {

	// @Override
	// public String intercept(ActionInvocation invocation) throws Exception {

	// HttpServletRequest request = (HttpServletRequest)
	// ServletActionContext.getRequest();

	// String clientType = request.getHeader("X-Client-Type");
	// String tokenValue = null;
	// String requestURI = request.getRequestURI()+"?"+request.getQueryString();

	// if (requestURI.startsWith("/testcreator")) {
	// requestURI = requestURI.substring("/testcreator/api".length());
	// }

	// boolean haveRedirect = requestURI.contains("/join");

	// System.out.println("Path info : "+requestURI);

	// // For mobile
	// if (clientType != null && clientType.equals("mobile")) {
	// String authHeader = request.getHeader("Authorization");
	// if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	// Object action = invocation.getAction();
	// if(action instanceof JsonApiAction jsonAction) {
	// ApiError apiError = new ApiError("Authentication failed", 301);
	// if(haveRedirect) {
	// apiError.setRedirectURI(requestURI);
	// }
	// jsonAction.setError(apiError);
	// }
	// return Action.LOGIN;
	// }

	// tokenValue = authHeader.split(" ")[1];
	// }
	// // For Web
	// else {

	// Cookie[] cookies = request.getCookies();

	// if (cookies == null) {
	// Object action = invocation.getAction();
	// if(action instanceof JsonApiAction jsonAction) {
	// ApiError apiError = new ApiError("Authentication failed", 301);
	// if(haveRedirect) {
	// apiError.setRedirectURI(requestURI);
	// }
	// jsonAction.setError(apiError);
	// }
	// return Action.LOGIN;
	// }
	// for (Cookie cookie : cookies) {
	// if (cookie.getName().equals("token")) {
	// tokenValue = cookie.getValue();
	// break;
	// }
	// }

	// }

	// if (tokenValue == null) {
	// Object action = invocation.getAction();
	// if(action instanceof JsonApiAction jsonAction) {
	// ApiError apiError = new ApiError("Authentication failed", 301);
	// if(haveRedirect) {
	// apiError.setRedirectURI(requestURI);
	// }
	// jsonAction.setError(apiError);
	// }
	// return Action.LOGIN;
	// }

	// JwtUtil jwtUtil = new JwtUtil(ServletActionContext.getServletContext());

	// Claims claims = jwtUtil.verifyToken(tokenValue);

	// if (claims != null) {

	// //
	// if(request.getRequestURL().toString().contains("testcreator/api/isLoggedin"))
	// {
	// // System.out.println("redirected");
	// // return Action.SUCCESS;
	// // }

	// request.setAttribute("token", claims);
	// request.setAttribute("userId", claims.getSubject());
	// return invocation.invoke();
	// }

	// Object action = invocation.getAction();
	// if(action instanceof JsonApiAction jsonAction) {
	// ApiError apiError = new ApiError("Authentication failed", 301);
	// if(haveRedirect) {
	// apiError.setRedirectURI(requestURI);
	// }
	// jsonAction.setError(apiError);
	// }

	// return Action.LOGIN;

	// }

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {

		HttpServletRequest request = (HttpServletRequest) ServletActionContext.getRequest();

		String clientType = request.getHeader("X-Client-Type");
		String tokenValue = null;
		String requestURI = request.getRequestURI() + "?" + request.getQueryString();

		if (requestURI.startsWith("/testcreator")) {
			requestURI = requestURI.substring("/testcreator/api".length());
		}

		boolean haveRedirect = requestURI.contains("/join");

		System.out.println("Path info : " + requestURI);

		String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			Object action = invocation.getAction();
			if (action instanceof JsonApiAction jsonAction) {
				ApiError apiError = new ApiError("Authentication failed", 301);
				if (haveRedirect) {
					apiError.setRedirectURI(requestURI);
				}
				jsonAction.setError(apiError);
			}
			return Action.LOGIN;
		}

		tokenValue = authHeader.split(" ")[1];

		JwtUtil jwtUtil = new JwtUtil(ServletActionContext.getServletContext());

		Claims claims = jwtUtil.verifyToken(tokenValue);

		if (claims != null) {
			request.setAttribute("token", claims);
			request.setAttribute("userId", claims.getSubject());
			return invocation.invoke();
		}

		Object action = invocation.getAction();
		if (action instanceof JsonApiAction jsonAction) {
			ApiError apiError = new ApiError("Authentication failed", 301);
			if (haveRedirect) {
				apiError.setRedirectURI(requestURI);
			}
			jsonAction.setError(apiError);
		}

		return Action.LOGIN;
	}

}