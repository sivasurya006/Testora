
	package com.testcreator.dao;


import java.sql.Connection;
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
import java.sql.Date;
import java.sql.NClob;
import java.sql.ParameterMetaData;
=======
<<<<<<< HEAD

public class TestDao {
	
	
	private Connection connection;

	public TestDao(Connection connection) {
		this.connection = connection;
	}
	public List<TestDto>  getAllTests(int classroomId){
		List<TestDto>
	}
	
=======
>>>>>>> caf95c280d9e38cf2bbdd82ef61bec727d835b53
>>>>>>> ea7601214d1ee30837bdfb5dc38173ea777576cd
>>>>>>> 967e0fb67e89d326813a141845e9081574ca5628
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.QuestionDto;
import com.testcreator.dto.TestDto;
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

	public List<TestDto> getAllTests(int classroomId, int limit) throws SQLException {
		List<TestDto> allTests = null;
		String selectTestQuery = limit < 0 ? Queries.selectTests : Queries.selectTestsWithLimit;
		try (PreparedStatement ps = connection.prepareStatement(selectTestQuery)) {
			ps.setInt(1, classroomId);
			if (limit > 0) {
				ps.setInt(2, limit);
			}

			try (ResultSet rs = ps.executeQuery()) {
				allTests = new LinkedList<TestDto>();
				while (rs.next()) {
					TestDto testDto = new TestDto();
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));
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
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));
					allTests.add(testDto);
				}
			}

		}
		return allTests;
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
					testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));
				} else {
					throw new SQLException("Can't get create test");
				}
			}
		}
		return testDto;
	}

<<<<<<< HEAD
	public QuestionDto createNewQuetion(int testId, String questionText, QuestionType type, int marks,
			List<Option> options) throws SQLException {
		QuestionDto questionDto = null;
		try (PreparedStatement ps = connection.prepareStatement(Queries.insertQuestion,
				Statement.RETURN_GENERATED_KEYS)) {
			ps.setInt(1, testId);
			ps.setString(2, type.name().toLowerCase());
			ps.setString(3, questionText);
			ps.setInt(4, marks);
=======

	public List<TestDto> getAllTests(int classroomId, int limit) throws SQLException {
		List<TestDto> allTests = null;
		String selectTestQuery = limit < 0 ? Queries.selectTests : Queries.selectTestsWithLimit;
		try(PreparedStatement ps = connection.prepareStatement(selectTestQuery)){
			ps.setInt(1, classroomId);
			if(limit > 0) {
				ps.setInt(2, limit);
				System.out.println("setting limit : "+limit);
			}
			
			try(ResultSet rs = ps.executeQuery()){
				allTests = new LinkedList<TestDto>();	
				while(rs.next()) {
					TestDto testDto = new TestDto();
//					test_id | classroom_id | creator_id | title  | correction_type | created_at          | is_timed | duration_minutes | status | maximumAttempts 
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
//					testDto.setCreatorId(rs.getInt("creator_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));	
					allTests.add(testDto);
				}
			}
			
		}
		return allTests;
	}
	
	
	public List<TestDto> getTestsByStatus(int classroomId, int limit,TestStatus status) throws SQLException {
		List<TestDto> allTests = null;
		String selectTestQuery = limit < 0 ? Queries.selectTestsByStatus : Queries.selectTestsByStatusWithLimit;
		try(PreparedStatement ps = connection.prepareStatement(selectTestQuery)){
			ps.setInt(1, classroomId);
			ps.setString(2, status.name().toLowerCase());
			if(limit > 0) {
				ps.setInt(3, limit);
				System.out.println("setting limit : "+limit);
			}
			
			try(ResultSet rs = ps.executeQuery()){
				allTests = new LinkedList<TestDto>();	
				while(rs.next()) {
					TestDto testDto = new TestDto();
//					test_id | classroom_id | creator_id | title  | correction_type | created_at          | is_timed | duration_minutes | status | maximumAttempts 
					testDto.setTestId(rs.getInt("test_id"));
					testDto.setClassroomId(rs.getInt("classroom_id"));
//					testDto.setCreatorId(rs.getInt("creator_id"));
					testDto.setTestTitle(rs.getString("title"));
					testDto.setCorrectionMethod(CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					testDto.setTimedTest(rs.getBoolean("is_timed"));
					testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
					testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));	
					allTests.add(testDto);
				}
			}
			
		}
		return allTests;
	}
	
>>>>>>> 967e0fb67e89d326813a141845e9081574ca5628

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
						questionDto.setOptions(createNewOptions(questionId, options));
					}
				} else {
					throw new SQLException("Can't get the generated question id");
				}
			}

		}
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
				ps.setBoolean(3, option.isCorrect());
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
						createdOption.setOptionMark(option.getOptionMark());
						createdOption.setCorrect(option.isCorrect());

						createdOptions.add(createdOption);
					} else {
						throw new SQLException("Can't get the generated option id");
					}
				}

			}
		}
		return createdOptions;
	}
}
