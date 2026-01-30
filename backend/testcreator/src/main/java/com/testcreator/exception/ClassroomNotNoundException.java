package com.testcreator.exception;

public class ClassroomNotNoundException extends RuntimeException{
	public ClassroomNotNoundException(String message) {
		super(message);
	}
	public ClassroomNotNoundException() {
		super("No classroom found");
	}
}
