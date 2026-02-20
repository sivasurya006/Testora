package com.testcreator.model;

import com.testcreator.dto.AnswerPropertiesDto;

public class Answer {
	
	private Integer answerId;
	private Integer questionId;
    private Integer optionId;
    private Boolean correct;
    private Integer givenMarks;
    
    private AnswerPropertiesDto properties;
    
   
	public Integer getAnswerId() {
		return answerId;
	}
	public void setAnswerId(Integer answerId) {
		this.answerId = answerId;
	}
	public Integer getQuestionId() {
		return questionId;
	}
	public void setQuestionId(Integer questionId) {
		this.questionId = questionId;
	}
	public Integer getOptionId() {
		return optionId;
	}
	public void setOptionId(Integer optionId) {
		this.optionId = optionId;
	}
	public Boolean getCorrect() {
		return correct;
	}
	public void setCorrect(Boolean correct) {
		this.correct = correct;
	}
	public Integer getGivenMarks() {
		return givenMarks;
	}
	public void setGivenMarks(Integer givenMarks) {
		this.givenMarks = givenMarks;
	}
	
	
	
	public AnswerPropertiesDto getAnswerPropertiesDto() {
		return properties;
	}
	public void setAnswerPropertiesDto(AnswerPropertiesDto properties) {
		this.properties = properties;
	}
	@Override
	public String toString() {
		return "Answer [answerId=" + answerId + ", questionId=" + questionId + ", optionId=" + optionId + ", correct="
				+ correct + ", givenMarks=" + givenMarks + "]";
	}
    
    
    
}
