package com.testcreator.exception;

public class MaximumAttemptsException extends RuntimeException {
	public MaximumAttemptsException(String msg) {
		super(msg);
	}
	
	public MaximumAttemptsException() {
		this("Maximum attempts reached");
	}
}
