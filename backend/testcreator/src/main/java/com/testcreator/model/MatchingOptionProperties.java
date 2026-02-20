package com.testcreator.model;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.JsonObject;

public class MatchingOptionProperties implements OptionProperties {
	private String match;
	
	public String getMatch() {
		return match;
	}
	public void setMatch(String match) {
		this.match = match;
	}
	
	public MatchingOptionProperties(String match) {	
		this.match = match;
	}
	
	public MatchingOptionProperties() {}
	
	@JSON(serialize = false)
	@Override
	public JsonObject getProperties() {
		JsonObject props = new JsonObject();
		if(match != null) {
			props.addProperty("match", match);
		}
		return props;
	}
}
