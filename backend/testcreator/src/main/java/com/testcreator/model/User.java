package com.testcreator.model;

import java.time.Instant;

public class User {
	private final String name;
	private final int userId;
	private final String email;
	private final Long registeredAt;
	
	public User(String name, int userId, String email, Long registeredAt) {
		this.name = name;
		this.userId = userId;
		this.email = email;
		this.registeredAt = registeredAt;
	}
	
	public String getName() {
		return name;
	}
	public int getUserId() {
		return userId;
	}
	public String getEmail() {
		return email;
	}
	public Long getregisteredAt() {
		return registeredAt;
	}
	
}
