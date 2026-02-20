package com.testcreator.model;

import org.apache.struts2.json.annotations.JSON;

public class Option {

	private int answerId;
	private String optionText;
	private Integer optionMark;
	private int optionId;
	private Boolean correct;
	private BlankOptionProperties blankOptionProperties;
	private MatchingOptionProperties matchingOptionProperties;

	private OptionProperties optionProperties;

	public OptionProperties getOptionProperties() {
		return optionProperties;
	}

	public BlankOptionProperties getBlankOptionProperties() {
		return blankOptionProperties;
	}

	public void setBlankOptionProperties(BlankOptionProperties blankOptionProperties) {
		this.blankOptionProperties = blankOptionProperties;
	}

	public MatchingOptionProperties getMatchingOptionProperties() {
		return matchingOptionProperties;
	}

	public void setMatchingOptionProperties(MatchingOptionProperties matchingOptionProperties) {
		this.matchingOptionProperties = matchingOptionProperties;
	}

	public void setOptionProperties(OptionProperties optionProperties) {
		this.optionProperties = optionProperties;
	}

	public void setOptionProperties(QuestionType type) {
		switch (type) {
		case FILL_BLANK: {
			this.optionProperties = blankOptionProperties;
			return;
		}
		case MATCHING: {
			this.optionProperties = matchingOptionProperties;
			return;
		}
		default:
			throw new IllegalArgumentException("Unexpected value: " + type);
		}
	}

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
	
	@JSON(serialize = false)
	public int getAnswerId() {
		return answerId;
	}

	public void setAnswerId(int answerId) {
		this.answerId = answerId;
	}

	@Override
	public String toString() {
		return "Option [answerId=" + answerId + ", optionText=" + optionText + ", optionMark=" + optionMark
				+ ", optionId=" + optionId + ", correct=" + correct + ", blankOptionProperties=" + blankOptionProperties
				+ ", matchingOptionProperties=" + matchingOptionProperties + ", optionProperties=" + optionProperties
				+ "]";
	}

	

}
