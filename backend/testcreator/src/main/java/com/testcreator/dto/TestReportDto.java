package com.testcreator.dto;

import java.util.List;

public class TestReportDto {
	
	private TestDto test;
	private Integer totalMarks;
	private List<QuestionReportDto> questions;
	
	public TestDto getTest() {
		return test;
	}
	public void setTest(TestDto test) {
		this.test = test;
	}
	public Integer getTotalMarks() {
		return totalMarks;
	}
	public void setTotalMarks(Integer totalMarks) {
		this.totalMarks = totalMarks;
	}
	public List<QuestionReportDto> getQuestions() {
		return questions;
	}
	public void setQuestions(List<QuestionReportDto> questions) {
		this.questions = questions;
	}
	
	
}
