package com.testcreator.model;

public class Option {

	private String optionText;
	private int optionMark;
	private int optionId;
	private boolean correct;
	
	public int getOptionId() {
		return optionId;
	}
	public void setOptionId(int optionId) {
		this.optionId = optionId;
	}
	public boolean isCorrect() {
		return correct;
	}
	public void setCorrect(boolean correct) {
		this.correct = correct;
	}
	public String getOptionText() {
		return optionText;
	}
	public void setOptionText(String optionText) {
		this.optionText = optionText;
	}
	public int getOptionMark() {
		return optionMark;
	}
	public void setOptionMark(int optionMark) {
		this.optionMark = optionMark;
	}
	@Override
	public String toString() {
		return "Option [optionText=" + optionText + ", optionMark=" + optionMark + ", optionId=" + optionId
				+ ", correct=" + correct + "]";
	}
	
	
}
