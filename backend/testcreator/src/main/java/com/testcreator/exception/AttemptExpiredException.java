package com.testcreator.exception;

public class AttemptExpiredException extends RuntimeException{
	public AttemptExpiredException(String message) {
		super(message);
	}
	public AttemptExpiredException() {
		super("Attempt expired");
	}
}





