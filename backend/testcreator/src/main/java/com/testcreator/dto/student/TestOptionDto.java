package com.testcreator.dto.student;

import org.apache.struts2.json.annotations.JSON;

import com.testcreator.model.BlankOptionProperties;
import com.testcreator.model.MatchingOptionProperties;
import com.testcreator.model.OptionProperties;

public class TestOptionDto {
	private Integer optionId;
	private String optionText;
	
	private BlankOptionProperties blankOptionProperties;
	private MatchingOptionProperties matchingOptionProperties;
	
	public Integer getOptionId() {
		return optionId;
	}
	public void setOptionId(Integer optionId) {
		this.optionId = optionId;
	}
	public String getOptionText() {
		return optionText;
	}
	public void setOptionText(String optionText) {
		this.optionText = optionText;
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
	
	@JSON(serialize = false)
	public OptionProperties getOptionProperties() {
		if(matchingOptionProperties == null) {
			return blankOptionProperties;
		}
		return matchingOptionProperties;
	}
	
}
