package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.TestDto;
import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.TestStatus;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.util.Queries;

public class StudentTestDao {

	private Connection connection;
	List<TestDto> tests = new LinkedList<TestDto>();

	public StudentTestDao() throws SQLException {
		try {
			this.connection = DBConnectionMaker.getInstance(ServletActionContext.getServletContext()).getConnection();
		} catch (ClassNotFoundException e) {
			throw new SQLException("Driver not found");
		}
	}

	public List<TestDto> getNewTests(int classroomId, int userId) throws SQLException {
		TestDto testDto;
		try (PreparedStatement selectTest = connection.prepareStatement(Queries.selectStudentTests)) {
			selectTest.setInt(1, userId);
			selectTest.setInt(2, classroomId);
			try (ResultSet rs = selectTest.executeQuery()) {
				while (rs.next()) {
					testDto = new TestDto();
					testDto.setTestId(rs.getInt("testId"));
					testDto.setTestId(rs.getInt("testId"));
					testDto.setTestTitle(rs.getString("testTitle"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					int maxAttempts = rs.getInt("maximum_attempts");
					int attemptCount = (rs.getInt("attemptCount"));
					int remainingAttempts = maxAttempts - attemptCount;
					testDto.setRemainingAttempts(remainingAttempts);
					testDto.setMaximumAttempts(maxAttempts);
					testDto.setCreatorName(rs.getString("creatorName"));
					testDto.setAttemptCount(attemptCount);
					testDto.setCreatedAt(rs.getTimestamp("createdAt").toInstant().getEpochSecond());
					testDto.setAttemptedTestStatus(rs.getString("status"));
//					testDto.setAttemptId(rs.getInt("attemptId"));
					testDto.setUserId(rs.getInt("userId"));
					if (rs.getBoolean("is_timed")) {
						testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					}
					this.tests.add(testDto);

				}
			}
		}
		return tests;
	}

	public List<TestDto> getStudentSubmittedTests(int classroomId, int userId) throws SQLException {
		TestDto submittedtTest;
		try (PreparedStatement selectTest = connection.prepareStatement(Queries.getStudentSubmittedTest)) {
			selectTest.setInt(2, userId);
			selectTest.setInt(1, classroomId);
			System.out.println("userid" + userId);
			try (ResultSet rs = selectTest.executeQuery()) {
				while (rs.next()) {
					submittedtTest = new TestDto();

					submittedtTest.setTestTitle(rs.getString("title"));
					submittedtTest.setAttemptCount(rs.getInt("attemptCount"));
					submittedtTest.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					submittedtTest.setTestId(rs.getInt("test_id"));
					submittedtTest.setClassroomId(rs.getInt("classroom_id"));
//					submittedtTest.setAttemptId(rs.getInt("attempt_id"));
					submittedtTest.setUserId(rs.getInt("userId"));

					this.tests.add(submittedtTest);

				}
			}
		}
		return tests;
	}
}
