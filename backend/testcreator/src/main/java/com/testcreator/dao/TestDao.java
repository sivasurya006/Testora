package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.TestDto;
import com.testcreator.dto.student.StartTestQuestionsDto;
import com.testcreator.dto.student.TestOptionDto;
import com.testcreator.dto.student.TestQuestionDto;
import com.testcreator.exception.QuestionNotFoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Context;
import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.Option;
import com.testcreator.model.QuestionType;
import com.testcreator.model.TestStatus;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.util.Queries;

public class TestDao {
	private Connection connection;

	public TestDao() throws SQLException {
		try {
			this.connection = DBConnectionMaker.getInstance(ServletActionContext.getServletContext()).getConnection();
		} catch (ClassNotFoundException e) {
			throw new SQLException("Driver not found");
		}
	}

	public TestDto createTest(int classroomId, int creatorId, String title) throws SQLException {
		try (PreparedStatement createTest = connection.prepareStatement(Queries.insertTest,
				Statement.RETURN_GENERATED_KEYS)) {
			createTest.setInt(1, classroomId);
			createTest.setInt(2, creatorId);
			createTest.setString(3, title);

			int rowsAffected = createTest.executeUpdate();
			if (rowsAffected == 0) {
				throw new SQLException("Creating test failed");
			}

			try (ResultSet create = createTest.getGeneratedKeys()) {
				if (create.next()) {
					int testId = create.getInt(1);
					return getTestById(testId);
				} else {
					throw new SQLException("Can't get auto generated id");
				}
			}
		}
	}

	public boolean publishTest(TestDto input) throws SQLException {
		boolean isTimed = input.getTimedTest() != null && input.getTimedTest();

		String query = isTimed ? Queries.updateTestOptionsAndPublish_Timed
				: Queries.updateTestOptionsAndPublish_NotTimed;

		try (PreparedStatement ps = connection.prepareStatement(query)) {
			ps.setString(1, input.getCorrectionMethod().name().toLowerCase());
			ps.setInt(2, input.getMaximumAttempts());
			if (isTimed) {
				ps.setInt(3, input.getDurationMinutes());
			}
			ps.setInt(isTimed ? 4 : 3, input.getTestId());
			return ps.executeUpdate() == 1;
		}
	}

	public boolean unPublishTest(int testId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.unPublishTest)) {
			ps.setInt(1, testId);
			return ps.executeUpdate() == 1;
		}
	}

	public boolean deleteTest(int testId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.deleteTest)) {
			ps.setInt(1, testId);
			return ps.executeUpdate() > 0;
		}
	}

	public boolean renameTest(int testId, String newName) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.renameTest)) {
			ps.setString(1, newName);
			ps.setInt(2, testId);
			return ps.executeUpdate() == 1;
		}
	}

	public TestDto getTestById(int testId) throws SQLException {
		TestDto testDto = null;
		try (PreparedStatement selectTest = connection.prepareStatement(Queries.selectTestByTestID)) {
			selectTest.setInt(1, testId);
			try (ResultSet rs = selectTest.executeQuery()) {
				if (rs.next()) {
					System.out.println("Test Id : " + testId);
					testDto = new TestDto();
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximum_attempts"));
				} else {
					throw new SQLException("Can't get create test");
				}
			}
		}
		return testDto;
	}

	public List<TestDto> getAllTests(int classroomId, int limit) throws SQLException {
		List<TestDto> allTests = null;
		String selectTestQuery = limit < 0 ? Queries.selectTests : Queries.selectTestsWithLimit;
		try (PreparedStatement ps = connection.prepareStatement(selectTestQuery)) {
			ps.setInt(1, classroomId);
			if (limit > 0) {
				ps.setInt(2, limit);
				System.out.println("setting limit : " + limit);
			}

			try (ResultSet rs = ps.executeQuery()) {
				allTests = new LinkedList<TestDto>();
				while (rs.next()) {
					TestDto testDto = new TestDto();
//					test_id | classroom_id | creator_id | title  | correction_type | created_at          | is_timed | duration_minutes | status | maximum_attempts 
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
//					testDto.setCreatorId(rs.getInt("creator_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximum_attempts"));
					allTests.add(testDto);
				}
			}

		}
		return allTests;
	}

	public List<TestDto> getTestsByStatus(int classroomId, int limit, TestStatus status) throws SQLException {
		List<TestDto> allTests = null;
		String selectTestQuery = limit < 0 ? Queries.selectTestsByStatus : Queries.selectTestsByStatusWithLimit;
		try (PreparedStatement ps = connection.prepareStatement(selectTestQuery)) {
			ps.setInt(1, classroomId);
			ps.setString(2, status.name().toLowerCase());
			if (limit > 0) {
				ps.setInt(3, limit);
				System.out.println("setting limit : " + limit);
			}

			try (ResultSet rs = ps.executeQuery()) {
				allTests = new LinkedList<TestDto>();
				while (rs.next()) {
					TestDto testDto = new TestDto();
//					test_id | classroom_id | creator_id | title  | correction_type | created_at          | is_timed | duration_minutes | status | maximum_attempts 
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
//					testDto.setCreatorId(rs.getInt("creator_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximum_attempts"));
					allTests.add(testDto);
				}
			}

		}
		return allTests;
	}

	public QuestionDto createNewQuetion(int testId, String questionText, QuestionType type, int marks,
			List<Option> options) throws SQLException {
		QuestionDto questionDto = null;
		try (PreparedStatement ps = connection.prepareStatement(Queries.insertQuestion,
				Statement.RETURN_GENERATED_KEYS)) {
			ps.setInt(1, testId);
			ps.setString(2, type.name().toLowerCase());
			ps.setString(3, questionText);
			ps.setInt(4, marks);

			int affectedRows = ps.executeUpdate();
			if (affectedRows == 0) {
				throw new SQLException("Can't insert a question");
			}

			try (ResultSet rs = ps.getGeneratedKeys()) {
				if (rs.next()) {
					int questionId = rs.getInt(1);
					questionDto = new QuestionDto();
					questionDto.setId(questionId);
					questionDto.setMarks(marks);
					questionDto.setQuestionText(questionText);
					questionDto.setType(type);
					if (options != null) {
						switch (questionDto.getType()) {
						case SINGLE:
						case MCQ:
						case BOOLEAN: {
							questionDto.setOptions(createNewOptions(questionId, options));
							break;
						}
						default:
							throw new IllegalArgumentException("Unexpected value: " + questionDto.getType());
						}
					}
				} else {
					throw new SQLException("Can't get the generated question id");
				}
			}

		}
		return questionDto;
	}

	public QuestionDto getQuestionBtId(int questionId, boolean showAnswers) throws SQLException {
		QuestionDto questionDto = null;
		System.out.println(questionId + " " + showAnswers);
		try (PreparedStatement ps = connection.prepareStatement(Queries.getQuestionWtthOptionsByQuestionId)) {
			ps.setInt(1, questionId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					questionDto = new QuestionDto();
					int testId = rs.getInt("test_id");
					if (!showAnswers) {
						TestDto testDto = getTestById(testId);
						if (testDto.getStatus() == TestStatus.DRAFT) {
							throw new UnauthorizedException("Test is not published");
						}
					}
					questionDto.setQuestionText(rs.getString("question_text"));
					questionDto.setId(questionId);
					questionDto.setMarks(rs.getInt("marks"));
					questionDto.setType(QuestionType.valueOf(rs.getString("type").toUpperCase()));
					List<Option> options = new LinkedList<>();
					Option option = new Option();
					option.setOptionId(rs.getInt("option_id"));
					if (showAnswers) {
						boolean isCorrect = rs.getBoolean("is_correct");
						if (isCorrect) {
							option.setCorrect(isCorrect);
						}
					}
					option.setOptionMark(rs.getInt("option_mark"));
					option.setOptionText(rs.getString("option_text"));
					options.add(option);

					while (rs.next()) {
						Option opt = new Option();
						opt.setOptionId(rs.getInt("option_id"));
						if (showAnswers) {
							boolean isCorrect = rs.getBoolean("is_correct");
							if (isCorrect) {
								opt.setCorrect(isCorrect);
							}
							opt.setOptionMark(rs.getInt("option_mark"));
						}
						opt.setOptionText(rs.getString("option_text"));
						options.add(opt);
					}

					questionDto.setOptions(options);
				}
			}
		}

		System.out.println(questionDto);

		return questionDto;
	}

	public List<Option> createNewOptions(int questionId, List<Option> options) throws SQLException {
		List<Option> createdOptions = new LinkedList<Option>();
		for (Option option : options) {
			if (option.getOptionText() == null || option.getOptionText().isBlank() || option.getOptionMark() < 0) {
				continue;
			}
			try (PreparedStatement ps = connection.prepareStatement(Queries.insertOption,
					Statement.RETURN_GENERATED_KEYS)) {
				ps.setInt(1, questionId);
				ps.setString(2, option.getOptionText());
				ps.setBoolean(3, option.getCorrect());
				ps.setInt(4, option.getOptionMark());

				int affectedRows = ps.executeUpdate();

				if (affectedRows == 0) {
					throw new SQLException("Can't insert an option");
				}

				try (ResultSet rs = ps.getGeneratedKeys()) {
					if (rs.next()) {
						Option createdOption = new Option();
						createdOption.setOptionId(rs.getInt(1));
						createdOption.setOptionText(option.getOptionText());
//						createdOption.setOptionMark(option.getOptionMark());
						System.out.println(option.getCorrect());
						if (option.getCorrect()) {
							createdOption.setCorrect(true);
						}
						createdOptions.add(createdOption);
					} else {
						throw new SQLException("Can't get the generated option id");
					}
				}

			}
		}
		System.out.println(createdOptions);
		return createdOptions;
	}

	public boolean deleteQuestion(int questionId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.deleteQuestion)) {
			ps.setInt(1, questionId);
			return ps.executeUpdate() > 0;
		}
	}

	public boolean deleteOption(int optionId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.deleteOption)) {
			ps.setInt(1, optionId);
			return ps.executeUpdate() > 0;
		}
	}

	public boolean updateQuestion(QuestionDto questionDto) throws SQLException {
		int questionId = questionDto.getId();
		try (PreparedStatement ps = connection.prepareStatement(Queries.updateQuestion)) {
			ps.setString(1, questionDto.getQuestionText());
			ps.setString(2, questionDto.getType().name().toLowerCase());
			ps.setInt(3, questionDto.getMarks());
			ps.setInt(4, questionId);

			int affectedRows = ps.executeUpdate();

			if (affectedRows > 0) {

				// update Options set option_text = ?, is_correct = ? , option_mark = ? where
				// option_id = ?
				if (questionDto.getOptions() != null) {
					for (Option option : questionDto.getOptions()) {

						try (PreparedStatement optionUpdate = connection.prepareStatement(Queries.updateOptions)) {
							optionUpdate.setString(1, option.getOptionText());
							optionUpdate.setBoolean(2, option.getCorrect());
							optionUpdate.setInt(3, option.getOptionMark());
							optionUpdate.setInt(4, option.getOptionId());
							optionUpdate.executeUpdate();
						}

					}
				}
				return true;
			} else {
				throw new QuestionNotFoundException();
			}
		}
	}

	public TestDto getTestQuestions(int testId, boolean showAnswers) throws SQLException {

		TestDto testDto = null;

		try (PreparedStatement ps = connection.prepareStatement(Queries.getAllQuestionsWithOptions)) {

			System.out.println(testId + " test Id");

			ps.setInt(1, testId);

			try (ResultSet rs = ps.executeQuery()) {

				Map<Integer, QuestionDto> questionMap = new LinkedHashMap<>();

				while (rs.next()) {
					if (testDto == null) {
						testDto = new TestDto();
						if (!showAnswers) {
							TestDto test = getTestById(testId);
							if (test.getStatus() == TestStatus.DRAFT) {
								throw new UnauthorizedException("Test is not published");
							}
						}
						testDto.setQuestions(new LinkedList<>());
					}
					int questionId = rs.getInt("question_id");
					if (questionId > 0) {
						QuestionDto questionDto = questionMap.get(questionId);
						if (questionDto == null) {
							questionDto = new QuestionDto();
							questionDto.setId(questionId);
							questionDto.setQuestionText(rs.getString("question_text"));
							questionDto.setMarks(rs.getInt("marks"));
							questionDto.setType(QuestionType.valueOf(rs.getString("type").toUpperCase()));
							questionDto.setOptions(new LinkedList<>());
							questionMap.put(questionId, questionDto);
							testDto.getQuestions().add(questionDto);
						}
						int optionId = rs.getInt("option_id");
						if (optionId > 0) {
							Option option = new Option();
							option.setOptionId(optionId);
							option.setOptionText(rs.getString("option_text"));
							if (showAnswers) {
								boolean isCorrect = rs.getBoolean("is_correct");
								if (isCorrect) {
									option.setCorrect(isCorrect);
								}
								option.setOptionMark(rs.getInt("option_mark"));
							}
							questionDto.getOptions().add(option);
						}
					}
				}
			}
		}

		return testDto;
	}

	public TestDto getTestCount(int userId) {
		TestDto testDto = null;
		try (PreparedStatement ps = connection.prepareStatement(Queries.selectTestCount)) {
			ps.setInt(1, userId);
			try (ResultSet rs = ps.executeQuery()) {

				while (rs.next()) {
					testDto = new TestDto();
					testDto.setTestCount(rs.getInt("testCount"));
//   					System.out.println(testDto);
//   					System.out.println(testDto.getTestCount());

				}
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return testDto;
	}
	
	
	public StartTestQuestionsDto startTest(int userId,int testId) throws SQLException {
		StartTestQuestionsDto test = null;
		try(PreparedStatement newAttempt = connection.prepareStatement(Queries.newAttempt, Statement.RETURN_GENERATED_KEYS )){
			newAttempt.setInt(1, testId);
			newAttempt.setInt(2, userId);
			int rowsAffected = newAttempt.executeUpdate();
			if(rowsAffected == 1) {
				
				int attemptId;
				
				try(ResultSet attemptRs = newAttempt.getGeneratedKeys()){
					if(attemptRs.next()) {
						attemptId = attemptRs.getInt(1);
					}else {
						throw new SQLException("Can't create new attempt");
					}
				}
				
				try(PreparedStatement getQuestions = connection.prepareStatement(Queries.getTestQuestionsWithAttempt)){
					getQuestions.setInt(1, testId);
					try(ResultSet rs = getQuestions.executeQuery()){
						Map<Integer,TestQuestionDto> questionMap = new LinkedHashMap<>();
						while (rs.next()) {
							if(test == null) {
								test = new StartTestQuestionsDto();
								test.setTitle(rs.getString("title"));
								boolean isTimed = rs.getBoolean("is_timed");
								if(isTimed) {
									test.setTimed(1);
									test.setDuration(rs.getInt("duration_minutes"));
								}
								test.setAttemptId(attemptId);
								test.setQuestions(new LinkedList<TestQuestionDto>());
							}
							int questionId = rs.getInt("question_id");
							TestQuestionDto question = questionMap.get(questionId);
							if(question == null) {
								question = new TestQuestionDto();
								question.setQuestionId(rs.getInt("question_id"));
								question.setType(QuestionType.valueOf(rs.getString("type").toUpperCase()));
								question.setQuestionText(rs.getString("question_text"));
								question.setOptions(new LinkedList<TestOptionDto>());
								questionMap.put(questionId, question);
								test.getQuestions().add(question);
							}
							TestOptionDto option = new TestOptionDto();
							option.setOptionId(rs.getInt("option_id"));
							option.setOptionText(rs.getString("option_text"));
							question.getOptions().add(option);
						}
					}
				}
			}
		}
		return test;
	}
	
	public boolean isPublished(int testId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.isTestPublished)) {
	        ps.setInt(1, testId);

	        try (ResultSet rs = ps.executeQuery()) {
	            return rs.next(); // true if row exists
	        }
	    }
	}

	public Context getMaxAndUserAttempts(int testId, int userId) throws SQLException {
		Context context = null;
		try(PreparedStatement ps = connection.prepareStatement(Queries.getMaxAndUserAttempts)){
			ps.setInt(1, testId);
			ps.setInt(2, userId);
			
			try(ResultSet rs = ps.executeQuery()){
				if(rs.next()) {
					context = new Context();
					context.setMaximumTestAttempts(rs.getInt("maximum_attempts"));
					context.setUserTestAttempts(rs.getInt("user_attempts"));
				}
			}
		}
		return context;
	}
	
	

}
