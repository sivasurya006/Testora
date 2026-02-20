package com.testcreator.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.testcreator.dto.AnswerPropertiesDto;
import com.testcreator.dto.QuestionReportDto;
import com.testcreator.dto.TestReportDto;
import com.testcreator.model.Answer;
import com.testcreator.model.AnswerSheet;
import com.testcreator.model.BlankOptionProperties;
import com.testcreator.model.MatchingOptionProperties;
import com.testcreator.model.Option;
import com.testcreator.model.Question;
import com.testcreator.model.QuestionType;


public class TestValidator {

	public static TestReportDto assignMarksAndCalculate(AnswerSheet answerSheet, List<Answer> answers) {

		TestReportDto report = new TestReportDto();
		report.setQuestions(new ArrayList<>());

		Map<Integer, List<Answer>> answerMap = groupAnswersByQuestion(answers);

		int totalMarks = 0;

		for (Question question : answerSheet.getQuestions()) {
			List<Answer> studentAnswers = answerMap.getOrDefault(question.getQuestionId(), new ArrayList<>());
			int questionMarks = validateQuestion(question, studentAnswers);

			totalMarks += questionMarks;

			QuestionReportDto questionReport = buildQuestionReport(question, studentAnswers, questionMarks);
			report.getQuestions().add(questionReport);
		}
		report.setTotalMarks(totalMarks);
		return report;
	}

	// Group answers by question
	private static Map<Integer, List<Answer>> groupAnswersByQuestion(List<Answer> answers) {
		Map<Integer, List<Answer>> map = new HashMap<>();
		for (Answer ans : answers) {
			Integer questionId = ans.getQuestionId();
			List<Answer> list = map.get(questionId);
			if (list == null) {
				list = new ArrayList<>();
				map.put(questionId, list);
			}
			list.add(ans);
		}
		return map;
	}

	private static int validateQuestion(Question question, List<Answer> studentAnswers) {

		switch (question.getType()) {

		case SINGLE:
		case BOOLEAN:
			return validateSingle(question, studentAnswers);

		case MCQ:
			return validateMCQ(question, studentAnswers);

		case FILL_BLANK:
			return validateFillBlank(question, studentAnswers);

		case MATCHING:
			return validateMatching(question, studentAnswers);

		default:
			return 0;
		}
	}

	// SINGLE and BOOLEAN
	private static int validateSingle(Question question, List<Answer> studentAnswers) {

		if (studentAnswers.isEmpty())
			return 0;

		Answer studentAnswer = studentAnswers.get(0);

		Option correctOption = question.getOptions().stream().filter(Option::getCorrect).findFirst().orElse(null);

		if (correctOption != null && correctOption.getOptionId() == studentAnswer.getOptionId()) {

			int marks = question.getMarks()
					+ (correctOption.getOptionMark() == null ? 0 : correctOption.getOptionMark());

			studentAnswer.setCorrect(true);
			studentAnswer.setGivenMarks(marks);
			return marks;
		}

		studentAnswer.setCorrect(false);
		studentAnswer.setGivenMarks(0);
		return 0;
	}

	// MCQ
	private static int validateMCQ(Question question, List<Answer> studentAnswers) {
		Set<Integer> correctOptionIds = question.getOptions().stream().filter(Option::getCorrect)
				.map(Option::getOptionId).collect(Collectors.toSet());
		Set<Integer> selectedOptionIds = studentAnswers.stream().map(Answer::getOptionId).collect(Collectors.toSet());
		int totalOptionMarks = 0;
		boolean anyWrongSelected = false;
		for (Answer ans : studentAnswers) {
			Option option = question.getOptions().stream().filter(opt -> opt.getOptionId() == ans.getOptionId())
					.findFirst().orElse(null);
			if (option != null && Boolean.TRUE.equals(option.getCorrect())) {
				int mark = option.getOptionMark() == null ? 0 : option.getOptionMark();
				ans.setCorrect(true);
				ans.setGivenMarks(mark);
				totalOptionMarks += mark;
			} else {
				ans.setCorrect(false);
				ans.setGivenMarks(0);
				anyWrongSelected = true;
			}
		}

		boolean allCorrectSelected = selectedOptionIds.containsAll(correctOptionIds)
				&& correctOptionIds.containsAll(selectedOptionIds);
		if (!anyWrongSelected && allCorrectSelected) {
			return totalOptionMarks + question.getMarks();
		}
		return totalOptionMarks;
	}

	// Wrapper for Blank Properties

	private static class BlankWrapper {
		String blankText;
		boolean isCaseSensitive;
		int mark;

		public BlankWrapper(String blankText, boolean isCaseSensitive, int mark) {
			this.blankText = blankText;
			this.isCaseSensitive = isCaseSensitive;
			this.mark = mark;
		}

		public BlankWrapper() {
		}

		public String getBlankText() {
			return blankText;
		}

		public void setBlankText(String blankText) {
			this.blankText = blankText;
		}

		public boolean isCaseSensitive() {
			return isCaseSensitive;
		}

		public void setCaseSensitive(boolean isCaseSensitive) {
			this.isCaseSensitive = isCaseSensitive;
		}

		public int getMark() {
			return mark;
		}

		public void setMark(int mark) {
			this.mark = mark;
		};
		
		

	}

	//BLANK
	private static int validateFillBlank(Question question, List<Answer> studentAnswers) {
	    int total = 0;
	    int blankCount = 0;

	    Map<Integer, BlankWrapper> blanks = new HashMap<>();
	    for (Option option : question.getOptions()) {
	        BlankOptionProperties props = option.getBlankOptionProperties();
	        blanks.put(props.getBlankIdx(), new BlankWrapper(option.getOptionText(), props.getIsCaseSensitive(), option.getOptionMark()));
	        blankCount++;
	    }

	    boolean anyWrongSelected = studentAnswers.isEmpty();

	    for (Answer ans : studentAnswers) {
	        var props = ans.getAnswerPropertiesDto();
	        if (props != null) {
	            Integer idx = props.getBlankIdx();
	            String studentText = props.getBlankText();
	            BlankWrapper correct = blanks.get(idx);

	            if (correct != null && studentText != null) {
	                boolean isCorrect = correct.isCaseSensitive() ?
	                        studentText.trim().equals(correct.getBlankText().trim()) :
	                        studentText.trim().equalsIgnoreCase(correct.getBlankText().trim());

	                ans.setCorrect(isCorrect);
	                ans.setGivenMarks(isCorrect ? correct.getMark() : 0);
	                if (isCorrect) total += correct.getMark();
	                else anyWrongSelected = true;
	            } else {
	                ans.setCorrect(false);
	                ans.setGivenMarks(0);
	                anyWrongSelected = true;
	            }
	        } else {
	            ans.setCorrect(false);
	            ans.setGivenMarks(0);
	            anyWrongSelected = true;
	        }
	    }

	    if (!anyWrongSelected) {
	        total += question.getMarks();
	    }

	    return total;
	}
	
	
	private static class MatchWrapper{
		String match;
		Integer mark;
		
		public MatchWrapper(String match, Integer mark) {
			this.match = match;
			this.mark = mark;
		}
		
		public String getMatch() {
			return match;
		}
		public void setMatch(String match) {
			this.match = match;
		}
		public Integer getMark() {
			return mark;
		}
		public void setMark(Integer mark) {
			this.mark = mark;
		}
		
		
	
	}

	// MATCHING
	private static int validateMatching(Question question, List<Answer> studentAnswers) {
		int total = 0;
		
		Map<Integer,MatchWrapper> correct = new HashMap<>(); 
		
		for(Option option : question.getOptions()) {
			correct.put(option.getOptionId(),new MatchWrapper(option.getMatchingOptionProperties().getMatch(), option.getOptionMark()));
		}
		
		boolean allCorrect = !studentAnswers.isEmpty();
		
		for(Answer answer : studentAnswers) {
			
			String selected = answer.getAnswerPropertiesDto().getMatch();
			MatchWrapper correctOption = correct.get(answer.getOptionId());
			
			if(selected == null) {
				answer.setCorrect(false);
				answer.setGivenMarks(0);
				allCorrect = false;
				continue;
			}
			
			if(correctOption.getMatch().equalsIgnoreCase(answer.getAnswerPropertiesDto().getMatch())) {
				answer.setCorrect(true);
				answer.setGivenMarks(correctOption.getMark());
				total += correctOption.getMark();
			}else {
				answer.setCorrect(false);
				answer.setGivenMarks(0);
				allCorrect = false;
			}
		}
		
		if(allCorrect) {
			total+=question.getMarks();
		}
		
		return total;
	}

	// Build QuestionReportDto
	private static QuestionReportDto buildQuestionReport(Question question, List<Answer> studentAnswers,
			int questionMarks) {

		QuestionReportDto dto = new QuestionReportDto();
		dto.setId(question.getQuestionId());
		dto.setType(question.getType());
		dto.setMarks(question.getMarks());
		dto.setQuestionText(question.getQuestionText());
		dto.setOptions(question.getOptions());
		dto.setGivenMarks(questionMarks);

		List<Answer> selected = new ArrayList<>();
		List<Option> actual = new ArrayList<>();

		for (Option opt : question.getOptions()) {
			for (Answer a : studentAnswers) {
				if (a.getOptionId().equals(opt.getOptionId())) {
					opt.setAnswerId(a.getAnswerId());
					selected.add(a);
				}
			}
			actual.add(opt);
		}

		dto.setSelectedOptions(selected);
		dto.setOptions(actual);
		return dto;
	}

}
