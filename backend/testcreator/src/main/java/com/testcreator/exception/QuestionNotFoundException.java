package com.testcreator.exception;

public class QuestionNotFoundException extends RuntimeException {
	public QuestionNotFoundException(String message) {
		super(message);
	}
	public QuestionNotFoundException() {
		super("No question found");
	}
}
