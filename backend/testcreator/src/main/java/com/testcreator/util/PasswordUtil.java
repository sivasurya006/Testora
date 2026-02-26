package com.testcreator.util;

import javax.servlet.ServletContext;
import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {

	private int costFactor;
	
	public PasswordUtil(ServletContext context) {
		this.costFactor =  (Integer) context.getAttribute("passwd.costFactor");		
	}
	
	public String getPasswordHash(String plainPassword) {
	 	String salt = BCrypt.gensalt(costFactor);
	 	return BCrypt.hashpw(plainPassword, salt);
	}
	
	public boolean verifyPassword(String plainPassword,String hashedPassword){
		return BCrypt.checkpw(plainPassword, hashedPassword);
	}
	
	// TODO : implement strong password method and valid email
	
	

}
