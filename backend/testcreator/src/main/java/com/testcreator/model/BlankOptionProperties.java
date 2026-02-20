package com.testcreator.model;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.JsonObject;

public class BlankOptionProperties implements OptionProperties {
	private Integer blankIdx;
	private Boolean isCaseSensitive;
	private String blankText;

	public BlankOptionProperties(Integer blankIdx, Boolean isCaseSensitive) {
	    this.blankIdx = blankIdx;
		this.isCaseSensitive = isCaseSensitive;
	}
	
	public BlankOptionProperties(Integer blankIdx, String blankText) {
	    this.blankIdx = blankIdx;
		this.blankText = blankText;
	}
	
	public BlankOptionProperties(Integer blankIdx) {
	    this.blankIdx = blankIdx;
	}
	
	public BlankOptionProperties() {}
	
	public Integer getBlankIdx() {
		return blankIdx;
	}
	public void setBlankIdx(Integer blankIdx) {
		this.blankIdx = blankIdx;
	}
	public Boolean getIsCaseSensitive() {
		return isCaseSensitive;
	}
	public void setIsCaseSensitive(Boolean isCaseSensitive) {
		this.isCaseSensitive = isCaseSensitive;
	}
	
	public String getBlankText() {
		return blankText;
	}

	public void setBlankText(String blankText) {
		this.blankText = blankText;
	}

	@JSON(serialize = false)
	@Override
	public JsonObject getProperties() {
		JsonObject props = new JsonObject();
		if(blankIdx != null) {
			props.addProperty("blankIdx", blankIdx);
		}
		if(isCaseSensitive != null) {
			props.addProperty("isCaseSensitive", isCaseSensitive);
		}
		if(blankText != null) {
			props.addProperty("blankText", blankText);
		}
		return props;
	}
	
}
