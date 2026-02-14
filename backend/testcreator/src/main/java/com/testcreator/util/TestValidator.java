package com.testcreator.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.testcreator.model.Answer;
import com.testcreator.model.Option;
import com.testcreator.model.Question;
import com.testcreator.model.QuestionAnswer;

public class TestValidator {

    public static List<QuestionAnswer> assignMarksAndCalculate(List<Question> questions, List<Answer> answers) {

        // option lookup
        Map<Integer, Map<Integer, Option>> questionOptionMap = new HashMap<>();
        for (Question q : questions) {
            Map<Integer, Option> optionMap = new HashMap<>();
            for (Option o : q.getOptions()) {
                optionMap.put(o.getOptionId(), o);
            }
            questionOptionMap.put(q.getQuestionId(), optionMap);
        }

        // answers by questionId
        Map<Integer, List<Answer>> answerMap = new HashMap<>();
        for (Answer a : answers) {
            if (!answerMap.containsKey(a.getQuestionId())) {
                answerMap.put(a.getQuestionId(), new ArrayList<>());
            }
            answerMap.get(a.getQuestionId()).add(a);
        }

        List<QuestionAnswer> questionAnswers = new LinkedList<>();

        for (Question q : questions) {
            List<Answer> answerList = answerMap.getOrDefault(q.getQuestionId(), Collections.emptyList());
            Map<Integer, Option> optionMap = questionOptionMap.get(q.getQuestionId());

            int totalGivenMarks = 0;
            boolean isAllCorrect = true;

            if (optionMap == null) {
                for (Answer a : answerList) {
                    a.setCorrect(false);
                    a.setGivenMarks(0);
                }
                q.setMarks(0);
                questionAnswers.add(new QuestionAnswer(answerList, q));
                continue;
            }

            Map<Integer, Boolean> correctOptionSelected = new HashMap<>();
            for (Option o : optionMap.values()) {
                if (o.getCorrect() != null && o.getCorrect()) {
                    correctOptionSelected.put(o.getOptionId(), false);
                }
            }

            for (Answer a : answerList) {
                Option selectedOption = optionMap.get(a.getOptionId());
                if (selectedOption != null) {
                    boolean isCorrect = selectedOption.getCorrect() != null && selectedOption.getCorrect();
                    a.setCorrect(isCorrect);
                    int givenMarks = isCorrect
                            ? (selectedOption.getOptionMark() != null ? selectedOption.getOptionMark().intValue() : 0)
                            : 0;
                    a.setGivenMarks(givenMarks);
                    totalGivenMarks += givenMarks;

                    if (isCorrect) {
                        correctOptionSelected.put(a.getOptionId(), true);
                    } else {
                        isAllCorrect = false;
                    }
                } else {
                    a.setCorrect(false);
                    a.setGivenMarks(0);
                    isAllCorrect = false;
                }
            }

            
            for (boolean selected : correctOptionSelected.values()) {
                if (!selected) {
                    isAllCorrect = false;
                    break;
                }
            }

   
            q.setMarks(isAllCorrect ? totalGivenMarks + q.getMarks() : totalGivenMarks);

            questionAnswers.add(new QuestionAnswer(answerList, q));
        }

        return questionAnswers;
    }
}
