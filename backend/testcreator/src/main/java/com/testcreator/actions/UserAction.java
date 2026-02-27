package com.testcreator.actions;



import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.util.ServletContextAware;

import com.testcreator.dto.ApiError;
import com.testcreator.dto.UserAuthenticationDto;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.service.Userservice;
import com.testcreator.util.InputValidatorUtil;
import com.testcreator.util.JwtUtil;


public class UserAction extends JsonApiAction implements ServletResponseAware, ServletRequestAware  , ServletContextAware{
	
	private String userName;
	private String userEmail;
	private String userPassword;
	private int userId;
	private HttpServletResponse response;
	private HttpServletRequest request;
	private ServletContext context;
	private UserAuthenticationDto authDto;
	
	public String signin() {
		
		if(! InputValidatorUtil.isValidEmail(userEmail)) {
			setError(new ApiError("Invalid email format", 400));
			return INPUT;
		}
		if(userPassword == null) {
			setError(new ApiError("Password can't be null", 400));
			return INPUT;
		}
		Userservice userservice = new Userservice();
		try {
			userId =  userservice.signin(userEmail, userPassword);
			if(userId == -1) {
				setError(new ApiError("Invalid email or password", 401));
				return LOGIN;
			}
			
			String clientType = request.getHeader("X-Client-Type");
			
			if(clientType == null) {
				setError(new ApiError("Client type missing", 401));
				return INPUT;
			}
			
			JwtUtil jwt = new JwtUtil(context);
			String token = jwt.generateToken(userId+"");
			
			this.authDto = new UserAuthenticationDto(true, token);
//			
//			if(clientType.equals("mobile")) {
//				this.authDto = new UserAuthenticationDto(true, token);
//			}else {
//				String cookie = "token=" + token +
//		                "; Path=/" +
//		                "; Max-Age=86400" +
//		                "; HttpOnly" +
//		                "; Secure" +
//		                "; SameSite=None";
//				response.setHeader("Set-Cookie", cookie);
//				this.authDto = new UserAuthenticationDto(true, null);
//			}
			return SUCCESS;
		}catch (UserNotFoundException e) {
			// TODO: logger
			setError(new ApiError("Invalid email or password", 401));
			return LOGIN;
		}
	}

	public UserAuthenticationDto getAuthDto() {
		return authDto;
	}

	public String signup() {
		if(! InputValidatorUtil.isValidUsername(userName)){
			setError(new ApiError("Invalid username", 400));
			return INPUT;
		}
		if(! InputValidatorUtil.isValidEmail(userEmail)) {
			setError(new ApiError("Invalid email", 400));
			return INPUT;
		}
		if(! InputValidatorUtil.isStrongPassword(userPassword)) {
			setError(new ApiError("not a string password", 400));
			return INPUT;
		}
		
		Userservice userservice = new Userservice();
		userId  =  userservice.signup(userName, userEmail, userPassword);
		
		if(userId == -1) {
			setError(new ApiError("User already exists", 409));
			return "duplicate";
		}
		
		String clientType = request.getHeader("X-Client-Type");
		
		if(clientType == null) {
			setError(new ApiError("Client type missing", 401));
			return INPUT;
		}
		
		
		
		JwtUtil jwt = new JwtUtil(context);
		String token = jwt.generateToken(userId+"");

		this.authDto = new UserAuthenticationDto(true, token);
		
//		if(clientType.equals("mobile")) {
//			this.authDto = new UserAuthenticationDto(true, token);
//		}else {
//			String cookie = "token=" + token +
//	                "; Path=/" +
//	                "; Max-Age=86400" +
//	                "; HttpOnly" +
//	                "; Secure" +
//	                "; SameSite=None";
//			response.setHeader("Set-Cookie", cookie);
//			this.authDto = new UserAuthenticationDto(true, null);
//		}
			
		return SUCCESS;
	}	
	
	
	public String signOut() {

	    String clientType = request.getHeader("X-Client-Type");

	    if (clientType == null) {
	        setError(new ApiError("Client type missing", 400));
	        return INPUT;
	    }

	    if (!clientType.equals("mobile")) {
	        Cookie cookie = new Cookie("token", "");
	        cookie.setHttpOnly(true);
	        cookie.setSecure(false); 
	        cookie.setPath("/");     
	        cookie.setMaxAge(0);     

	        response.addCookie(cookie);
	    }

	    this.authDto = new UserAuthenticationDto(true, null);

	    return SUCCESS;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	@Override
	public void setServletContext(ServletContext context) {
		this.context = context;
	}

	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {		
		this.request = request;
	}

	
}
