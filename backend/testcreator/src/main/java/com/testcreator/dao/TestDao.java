package com.testcreator.dao;

import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.NClob;
import java.sql.ParameterMetaData;
import java.sql.PreparedStatement;
import java.sql.Ref;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.RowId;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.TestDto;
import com.testcreator.model.CorrectionMethod;
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
		TestDto testDto = null;
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
					try(PreparedStatement selectTest = connection.prepareStatement(Queries.selectTestByTestID)){
						selectTest.setInt(1, testId);
						try(ResultSet rs = selectTest.executeQuery()){
							if(rs.next()) {
								System.out.println("Test Id : "+testId);
								testDto = new TestDto();
//								test_id | classroom_id | creator_id | title  | correction_type | created_at          | is_timed | duration_minutes | status | maximumAttempts 
								testDto.setTestId(rs.getInt("test_id"));
								testDto.setClassroomId(rs.getInt("classroom_id"));
//								testDto.setCreatorId(rs.getInt("creator_id"));
								testDto.setTestTitle(rs.getString("title"));
								testDto.setCorrectionMethod(CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
								testDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
								testDto.setTimedTest(rs.getBoolean("is_timed"));
								testDto.setDurationMinutes(rs.getInt("duration_minutes"));
								testDto.setStatus(TestStatus.valueOf(rs.getString("status").toUpperCase()));
								testDto.setMaximumAttempts(rs.getInt("maximumAttempts"));	
							}else {
								throw new SQLException("Can't get create test");
							}
						}
					}
				} else {
					throw new SQLException("Can't get auto generated id");
				}
			}
		}
		return testDto;
	}

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
	

}
