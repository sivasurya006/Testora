package com.testcreator.model;

import java.time.Instant;

public class User {
	private String name;
	private Integer userId;
	private String email;
	private Long registeredAt;
	private Integer totalTestCount;

	public Integer getTotalTestCount() {
		return totalTestCount;
	}

	public void setTotalTestCount(Integer totalTestCount) {
		this.totalTestCount = totalTestCount;
	}

	public Integer getTotalAttemptedTestCount() {
		return totalAttemptedTestCount;
	}

	public void setTotalAttemptedTestCount(Integer totalAttemptedTestCount) {
		this.totalAttemptedTestCount = totalAttemptedTestCount;
	}

	private Integer totalAttemptedTestCount;

	public User(String name, int userId, String email, Long registeredAt, Integer totalTestCount,
			Integer totalSubmittedTestCount) {
		this.name = name;
		this.userId = userId;
		this.email = email;
		this.registeredAt = registeredAt;
		this.totalTestCount = totalTestCount;
		this.totalAttemptedTestCount = totalSubmittedTestCount;
	}

	public User(String name, int userId, String email, Long registeredAt) {
		this.name = name;
		this.userId = userId;
		this.email = email;
		this.registeredAt = registeredAt;
	}

	public User() {
		this.name = "";
		this.userId = 0;
		this.email = "";
		this.registeredAt = null;
	}

	public String getName() {
		return name;
	}

	public Integer getUserId() {
		return userId;
	}

	public String getEmail() {
		return email;
	}

	public Long getregisteredAt() {
		return registeredAt;
	}

	public Long getRegisteredAt() {
		return registeredAt;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setRegisteredAt(Long registeredAt) {
		this.registeredAt = registeredAt;
	}
	
	

}
