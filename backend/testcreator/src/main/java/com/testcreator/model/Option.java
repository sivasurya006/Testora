package com.testcreator.model;

public class Option {

	private String optionText;
	private Integer optionMark;
	private int optionId;
	private Boolean correct;
	
	public int getOptionId() {
		return optionId;
	}
	public void setOptionId(int optionId) {
		this.optionId = optionId;
	}
	public Boolean getCorrect() {
		return correct;
	}
	public void setCorrect(Boolean correct) {
		this.correct = correct;
	}
	public String getOptionText() {
		return optionText;
	}
	public void setOptionText(String optionText) {
		this.optionText = optionText;
	}
	public Integer getOptionMark() {
		return optionMark;
	}
	public void setOptionMark(Integer optionMark) {
		this.optionMark = optionMark;
	}
	@Override
	public String toString() {
		return "Option [optionText=" + optionText + ", optionMark=" + optionMark + ", optionId=" + optionId
				+ ", correct=" + correct + "]";
	}
	
	
}
