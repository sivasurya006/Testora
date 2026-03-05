package com.testcreator.util;

public class InputValidatorUtil {

	public static boolean isValidEmail(String email) {
		return email != null && ! email.isBlank();
	}
	
	public static boolean isValidUsername(String name) {

		return name != null && ! name.isBlank();
	}
	
	public static boolean isStrongPassword(String password) {
		return password != null && ! password.isBlank();
	}
}