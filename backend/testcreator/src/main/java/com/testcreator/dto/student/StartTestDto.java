package com.testcreator.dto.student;

public class StartTestDto {
	
	private String wsUrl;
	private StartTestQuestionsDto test;
	public String getWsUrl() {
		return wsUrl;
	}
	public void setWsUrl(String wsUrl) {
		this.wsUrl = wsUrl;
	}
	public StartTestQuestionsDto getTest() {
		return test;
	}
	public void setTest(StartTestQuestionsDto test) {
		this.test = test;
	}


	
}
