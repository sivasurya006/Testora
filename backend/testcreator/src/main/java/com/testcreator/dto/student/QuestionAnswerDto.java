package com.testcreator.dto.student;

import java.util.List;

public class QuestionAnswerDto {
    private int questionId;
    private List<TestOptionDto> options;

    public int getQuestionId() { return questionId; }
    public void setQuestionId(int questionId) { this.questionId = questionId; }

    public List<TestOptionDto> getOptions() { return options; }
    public void setOptions(List<TestOptionDto> options) { this.options = options; }
}
