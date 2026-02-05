package com.testcreator.exception;

public class TestNotFoundException extends RuntimeException{
	public TestNotFoundException(String message) {
		super(message);
	}
	public TestNotFoundException() {
		super("No test found");
	}
}
