package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.testcreator.dto.AnswerPropertiesDto;
import com.testcreator.dto.AttemptDto;
import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.QuestionReportDto;
import com.testcreator.dto.TestDto;
import com.testcreator.dto.UserTestAttemptDto;
import com.testcreator.dto.student.StartTestQuestionsDto;
import com.testcreator.dto.student.TestOptionDto;
import com.testcreator.dto.student.TestQuestionDto;
import com.testcreator.exception.QuestionNotFoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Answer;
import com.testcreator.model.AnswerSheet;
import com.testcreator.model.Attempt;
import com.testcreator.model.AttemptStatus;
import com.testcreator.model.BlankOptionProperties;
import com.testcreator.model.Context;
import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.MatchingOptionProperties;
import com.testcreator.model.Option;
import com.testcreator.model.OptionProperties;
import com.testcreator.model.Question;
import com.testcreator.model.QuestionAnswer;
import com.testcreator.model.QuestionType;
import com.testcreator.model.Test;
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

	public TestDao(Connection connection) {
		this.connection = connection;
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
						case BOOLEAN:
						case FILL_BLANK:
						case MATCHING: {
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
							if (questionDto.getType() == QuestionType.FILL_BLANK) {
								JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
								System.out.println(" first option JSON : " + json.toString());
								option.setBlankOptionProperties(new BlankOptionProperties(
										json.get("blankIdx").getAsInt(), json.get("isCaseSensitive").getAsBoolean()));
							} else if (questionDto.getType() == QuestionType.MATCHING) {
								JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
								System.out.println(" second option JSON : " + json.toString());
								option.setMatchingOptionProperties(
										(new MatchingOptionProperties(json.get("match").getAsString())));
							}
						}
					}
					option.setOptionMark(rs.getInt("option_mark"));
					option.setOptionText(rs.getString("option_text"));
					options.add(option);

					while (rs.next()) {
						Option opt = new Option();
						opt.setOptionId(rs.getInt("option_id"));
						System.out.println("get question by id " + questionDto.getType().name());
						if (showAnswers) {
							boolean isCorrect = rs.getBoolean("is_correct");
							if (isCorrect) {
								opt.setCorrect(isCorrect);
								if (questionDto.getType() == QuestionType.FILL_BLANK) {
									JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
									System.out.println(" second option JSON : " + json.toString());
									opt.setBlankOptionProperties(
											new BlankOptionProperties(json.get("blankIdx").getAsInt(),
													json.get("isCaseSensitive").getAsBoolean()));
								} else if (questionDto.getType() == QuestionType.MATCHING) {
									JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
									System.out.println(" second option JSON : " + json.toString());
									opt.setMatchingOptionProperties(
											(new MatchingOptionProperties(json.get("match").getAsString())));
								}
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

				ps.setInt(4, option.getOptionMark());
				if (option.getOptionProperties() != null) {
					ps.setBoolean(3, true); // any way all blanks and Matching are correct
					ps.setString(5, option.getOptionProperties().getProperties().toString());
				} else {
					ps.setBoolean(3, option.getCorrect());
					ps.setString(5, "{}");
				}

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
						if (option.getCorrect() == null || option.getCorrect()) {
							createdOption.setCorrect(true);
						}
						if (option.getOptionProperties() != null) {
							if (option
									.getOptionProperties() instanceof MatchingOptionProperties matchingOptionProperties) {
								createdOption.setMatchingOptionProperties(matchingOptionProperties);
							}
							if (option.getOptionProperties() instanceof BlankOptionProperties blankOptionProperties) {
								createdOption.setBlankOptionProperties(blankOptionProperties);
							}
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

				LinkedList<Option> newOptions = new LinkedList<Option>();

				if (questionDto.getOptions() != null) {
					for (Option option : questionDto.getOptions()) {
						if (option.getOptionId() == 0) {
							newOptions.add(option);
							continue;
						}
						try (PreparedStatement optionUpdate = connection.prepareStatement(Queries.updateOptions)) {
							optionUpdate.setString(1, option.getOptionText());
							optionUpdate.setInt(3, option.getOptionMark());
							System.out.println("Updating option mark : " + option.getOptionMark());
							if (option.getOptionProperties() != null) {
								System.out.println("if");
								optionUpdate.setBoolean(2, true); // any way all blanks and Matching are correct
								optionUpdate.setString(4, option.getOptionProperties().getProperties().toString());
							} else {
								System.out.println("else");
								optionUpdate.setBoolean(2, option.getCorrect());
								optionUpdate.setString(4, "{}");
							}
							optionUpdate.setInt(5, option.getOptionId());
							System.out.println("For option id : " + option.getOptionId());
							optionUpdate.executeUpdate();
						}

					}
				}
				if (!newOptions.isEmpty()) {
					createNewOptions(questionId, newOptions);
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
									if (questionDto.getType() == QuestionType.FILL_BLANK) {
										JsonObject json = new Gson().fromJson(rs.getString("properties"),
												JsonObject.class);
										option.setBlankOptionProperties(
												new BlankOptionProperties(json.get("blankIdx").getAsInt()));
									} else if (questionDto.getType() == QuestionType.MATCHING) {
										JsonObject json = new Gson().fromJson(rs.getString("properties"),
												JsonObject.class);
										System.out.println(" second option JSON : " + json.toString());
										option.setMatchingOptionProperties(
												(new MatchingOptionProperties(json.get("match").getAsString())));
									}
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

	public TestDto getTestCount(int classroomId) {
		TestDto testDto = null;
		try (PreparedStatement ps = connection.prepareStatement(Queries.selectTestCount)) {
			ps.setInt(1, classroomId);
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

	public StartTestQuestionsDto startTest(int userId, int testId) throws SQLException {

		StartTestQuestionsDto test = null;
		try (PreparedStatement newAttempt = connection.prepareStatement(Queries.newAttempt,
				Statement.RETURN_GENERATED_KEYS)) {
			newAttempt.setInt(1, testId);
			newAttempt.setInt(2, userId);
			int rowsAffected = newAttempt.executeUpdate();
			if (rowsAffected == 1) {

				int attemptId;

				try (ResultSet attemptRs = newAttempt.getGeneratedKeys()) {
					if (attemptRs.next()) {
						attemptId = attemptRs.getInt(1);
					} else {
						throw new SQLException("Can't create new attempt");
					}
				}

				try (PreparedStatement getQuestions = connection
						.prepareStatement(Queries.getTestQuestionsWithAttempt)) {
					getQuestions.setInt(1, testId);
					try (ResultSet rs = getQuestions.executeQuery()) {
						Map<Integer, TestQuestionDto> questionMap = new LinkedHashMap<>();
						while (rs.next()) {

							if (test == null) {
								test = new StartTestQuestionsDto();
								test.setTitle(rs.getString("title"));
								boolean isTimed = rs.getBoolean("is_timed");
								if (isTimed) {
									test.setTimed(1);
									test.setDuration(rs.getInt("duration_minutes"));
								}
								test.setAttemptId(attemptId);
								test.setQuestions(new LinkedList<TestQuestionDto>());
							}
							int questionId = rs.getInt("question_id");
							TestQuestionDto question = questionMap.get(questionId);
							if (question == null) {
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
							if (question.getType() != QuestionType.FILL_BLANK) {
								option.setOptionText(rs.getString("option_text"));
							}
							if (question.getType() == QuestionType.MATCHING) {
								JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
								option.setMatchingOptionProperties(
										(new MatchingOptionProperties(json.get("match").getAsString())));
							}
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
				return rs.next();
			}
		}
	}

	public Context getMaxAndUserAttempts(int testId, int userId) throws SQLException {
		Context context = null;
		try (PreparedStatement ps = connection.prepareStatement(Queries.getMaxAndUserAttempts)) {
			ps.setInt(1, testId);
			ps.setInt(2, userId);

			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					context = new Context();
					context.setMaximumTestAttempts(rs.getInt("maximum_attempts"));
					context.setUserTestAttempts(rs.getInt("user_attempts"));
				}
			}
		}
		return context;
	}

	public boolean saveAnswer(int attemptId, Map<String, List<TestOptionDto>> answers) throws SQLException {

		boolean success = false;
		connection.setAutoCommit(false);

		try (PreparedStatement ps = connection.prepareStatement(Queries.insertAnswer)) {

			for (Map.Entry<String, List<TestOptionDto>> entry : answers.entrySet()) {

				Integer questionId = Integer.parseInt(entry.getKey());
				List<TestOptionDto> optionList = entry.getValue();
				for (TestOptionDto optionDto : optionList) {

					ps.setInt(1, attemptId);
					ps.setInt(2, questionId);
					ps.setInt(3, optionDto.getOptionId());
					if (optionDto.getBlankOptionProperties() != null) {
						ps.setString(4, optionDto.getOptionProperties().getProperties().toString());
					} else if (optionDto.getMatchingOptionProperties() != null) {
						ps.setString(4, optionDto.getMatchingOptionProperties().getProperties().toString());
					} else {
						ps.setString(4, "{}");
					}

					ps.addBatch();
				}
			}

			int[] results = ps.executeBatch();

			boolean allInserted = Arrays.stream(results).allMatch(r -> r > 0);

			if (allInserted) {
				try (PreparedStatement psUpdate = connection.prepareStatement(Queries.updateAttemptStatus)) {
					psUpdate.setInt(1, attemptId);
					psUpdate.executeUpdate();
				}
				connection.commit();
				success = true;
			} else {
				connection.rollback();
			}

		} catch (SQLException e) {
			connection.rollback();
			throw e;
		} finally {
			connection.setAutoCommit(true);
		}

		return success;
	}

	public Attempt getActiveAttempt(int testId, int userId) throws SQLException {

		try (PreparedStatement ps = connection.prepareStatement(Queries.getActveAttempt)) {
			ps.setInt(1, testId);
			ps.setInt(2, userId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					Attempt attempt = new Attempt();
					attempt.setAttemptId(rs.getInt("attempt_id"));
					attempt.setTestId(rs.getInt("test_id"));
					attempt.setUserId(rs.getInt("user_id"));
					attempt.setStartedAt(rs.getTimestamp("started_at"));
					attempt.setSubmittedAt(rs.getTimestamp("submitted_at"));
					attempt.setStatus(AttemptStatus.valueOf(rs.getString("status").toUpperCase()));
					attempt.setMarks(rs.getDouble("marks"));
					System.out.println(attempt);
					return attempt;
				}
			}
		}

		System.out.println("activity");

		return null;
	}

	public int getTestDuration(int testId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.getDurationMinutes)) {
			ps.setInt(1, testId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					boolean isTimed = rs.getBoolean("is_timed");
					if (!isTimed) {
						return 0;
					}
					return rs.getInt("duration_minutes");
				}
			}
		}
		System.out.println("duration ");
		return 0;
	}

	public AnswerSheet getOriginalAnswerSheet(int testId) throws SQLException {

		AnswerSheet answerSheet = new AnswerSheet();

		Map<Integer, Question> questionMap = new LinkedHashMap<>();

		try (PreparedStatement ps = connection.prepareStatement(Queries.getQuestions)) {
			ps.setInt(1, testId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {

					if (answerSheet.getTest() == null) {
						Test test = new Test();
						test.setTestId(testId);
						test.setTestTitle(rs.getString("correction_type"));
						test.setCorrectionMethod(
								CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
						answerSheet.setTest(test);
						answerSheet.setQuestions(new LinkedList<Question>());
					}

					int questionId = rs.getInt("question_id");
					int marks = rs.getInt("marks");
					String type = rs.getString("type");
					String questionText = rs.getString("question_text");

					Question question = questionMap.get(questionId);

					if (question == null) {
						question = new Question();
						question.setQuestionId(questionId);
						question.setMarks(marks);
						question.setQuestionText(questionText);
						question.setOptions(new ArrayList<>());
						question.setType(QuestionType.valueOf(type.toUpperCase()));
						answerSheet.getQuestions().add(question);
						questionMap.put(questionId, question);
					}

					int optionId = rs.getInt("option_id");
					boolean isCorrect = rs.getInt("is_correct") == 1;
					int optionMark = rs.getInt("option_mark");
					String optionText = rs.getString("option_text");

					Option option = new Option();
					option.setOptionId(optionId);
					option.setCorrect(isCorrect);
					option.setOptionMark(optionMark);
					option.setOptionText(optionText);
					question.getOptions().add(option);

					if (question.getType() == QuestionType.FILL_BLANK) {
						JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
						System.out.println(" first option JSON : " + json.toString());
						option.setBlankOptionProperties(new BlankOptionProperties(json.get("blankIdx").getAsInt(),
								json.get("isCaseSensitive").getAsBoolean()));
					}

					if (question.getType() == QuestionType.MATCHING) {
						JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
						option.setMatchingOptionProperties(
								(new MatchingOptionProperties(json.get("match").getAsString())));
					}

				}

			}
		}

		return answerSheet;
	}

	public List<Answer> getAnswers(int attemptId) throws SQLException {
		List<Answer> answers = new ArrayList<>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getAnswer)) {
			ps.setInt(1, attemptId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					Answer answer = new Answer();
					answer.setQuestionId(rs.getInt("question_id"));
					answer.setOptionId(rs.getInt("option_id"));
					answer.setAnswerId(rs.getInt("answer_id"));
					JsonObject json = new Gson().fromJson(rs.getString("properties"), JsonObject.class);
					AnswerPropertiesDto answerPropertiesDto = new AnswerPropertiesDto();

					JsonElement blankIdx = json.get("blankIdx");
					JsonElement blankText = json.get("blankText");
					JsonElement match = json.get("match");

					if (blankIdx != null && !blankIdx.isJsonNull()) {
						answerPropertiesDto.setBlankIdx(blankIdx.getAsInt());
					}
					if (blankText != null && !blankText.isJsonNull()) {
						answerPropertiesDto.setBlankText(blankText.getAsString());
					}
					if (match != null && !match.isJsonNull()) {
						answerPropertiesDto.setMatch(match.getAsString());
					}

					answer.setAnswerPropertiesDto(answerPropertiesDto);
					answers.add(answer);
				}
			}
		}
		System.out.println("submitted answers : " + answers);
		return answers;
	}

	public boolean updateAnswers(List<QuestionReportDto> questionAnswers, int totalMarks, int attemptId)
			throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.updateAnswer)) {

			for (QuestionReportDto questionReportDto : questionAnswers) {
				for (Answer option : questionReportDto.getSelectedOptions()) {

					System.out.println(option);

					ps.setBoolean(1, option.getCorrect());
					ps.setInt(2, option.getGivenMarks());
					ps.setInt(3, option.getAnswerId());
					System.out.println("Updating");
					ps.addBatch();
				}
			}

			System.out.println("Updated");

			if (Arrays.stream(ps.executeBatch()).allMatch(r -> r > 0)) {
				try (PreparedStatement psUpdate = connection.prepareStatement(Queries.updateAttemptStatusByEvaluated)) {
					psUpdate.setInt(1, totalMarks);
					psUpdate.setInt(2, attemptId);
					return psUpdate.executeUpdate() > 0;
				}
			}

			return false;
		}
	}

	public List<TestDto> getDashboardAnaliticsData(int classrommId) {
		List<TestDto> analiticsList = new ArrayList<TestDto>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getDashBoardAnaliticsData)) {

			try {
				ps.setInt(1, classrommId);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					TestDto analiticscDto = new TestDto();
					analiticscDto.setAttemptCount(rs.getInt("AttemptedStudentCountOnTest"));
					analiticscDto.setTestTitle((rs.getString("title")));
					analiticsList.add(analiticscDto);

				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		System.out.println("intestDto" + analiticsList.size());
		return analiticsList;
	}

	public List<TestDto> getTopPerformingData(int classrommId) {
		List<TestDto> analiticsList = new ArrayList<TestDto>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getDashBoardAnaliticsData)) {

			try {
				ps.setInt(1, classrommId);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					TestDto analiticscDto = new TestDto();
					analiticscDto.setAttemptCount(rs.getInt("AttemptedStudentCountOnTes"));
					analiticscDto.setTestTitle((rs.getString("title")));
					analiticsList.add(analiticscDto);

				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		System.out.println("intestDto" + analiticsList.size());
		return analiticsList;
	}

	public List<SubmissionDto> getSubmittedUsers(int classroomId) throws SQLException {
		List<SubmissionDto> submissions = new LinkedList<>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getSubmissionsWithAttempts)) {
			ps.setInt(1, classroomId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					SubmissionDto submission = new SubmissionDto();
					submission.setName(rs.getString("name"));
					submission.setEmail(rs.getString("email"));
					submission.setUserId(rs.getInt("user_id"));
					submission.setTestId(rs.getInt("test_id"));
					submission.setTitle(rs.getString("title"));

					Integer count = rs.getInt("attempts_count");
					count = count == null ? 0 : count;

					submission.setAttemptsCount(count);

					System.out.println(submission);

					submissions.add(submission);
				}
			}
		}
		return submissions;
	}

	public List<SubmissionDto> getTestSubmissionDetails(int classroomId, int testId) throws SQLException {
		List<SubmissionDto> submissions = new LinkedList<>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getTestSubmissionDetails)) {
			ps.setInt(1, classroomId);
			ps.setInt(2, testId);

			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					SubmissionDto submission = new SubmissionDto();
					submission.setName(rs.getString("name"));
					submission.setEmail(rs.getString("email"));
					submission.setUserId(rs.getInt("user_id"));

					Integer attemptsCount = rs.getInt("total_attempts");
					Integer evaluatedCount = rs.getInt("evaluated");
					Integer submittedCount = rs.getInt("submitted");

					attemptsCount = attemptsCount == null ? 0 : attemptsCount;
					evaluatedCount = evaluatedCount == null ? 0 : evaluatedCount;
					submittedCount = submittedCount == null ? 0 : submittedCount;

					submission.setAttemptsCount(attemptsCount);
					submission.setEvaluatedCount(evaluatedCount);
					submission.setSubmittedCount(submittedCount);

					submissions.add(submission);
				}
			}
		}
		return submissions;
	}

	public UserTestAttemptDto getUserTestAttempts(int testId, int userId) throws SQLException {
		
		UserTestAttemptDto userAttempt = new UserTestAttemptDto();
		List<AttemptDto> attempts = new LinkedList<>();
		try (PreparedStatement ps = connection.prepareStatement(Queries.getUserTestAttempts)) {
			ps.setInt(1, testId);
			ps.setInt(2, userId);
			try (ResultSet rs = ps.executeQuery()) {
				while (rs.next()) {
					
					if(userAttempt.getUserName() == null){
						userAttempt.setUserName(rs.getString("name"));
					}
					
					if(userAttempt.getUserEmail() == null) {
						userAttempt.setUserEmail(rs.getString("email"));
					}
					
					AttemptDto attempt = new AttemptDto();

					Long startedAt = rs.getTimestamp("started_at").toInstant().getEpochSecond();
					Long submittedAt = rs.getTimestamp("submitted_at").toInstant().getEpochSecond();
					Long timeTaken = null;


					if (startedAt != null && submittedAt != null) {
						timeTaken = submittedAt - startedAt;
					}
					
					attempt.setAttemptId(rs.getInt("attempt_id"));
					attempt.setStartedAt(startedAt);
					attempt.setSubmittedAt(submittedAt);
					attempt.setTimeTaken(timeTaken);
					attempt.setMarks(rs.getInt("marks"));
					attempt.setStatus(AttemptStatus.valueOf(rs.getString("status").toUpperCase()));

					attempts.add(attempt);
				}
			}
		}
		userAttempt.setAttempts(attempts);
		return userAttempt;
	}

}
