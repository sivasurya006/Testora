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
    List<TestDto> tests=new LinkedList<TestDto>();
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
				while(rs.next()) {
					testDto = new TestDto();
					testDto.setTestId(rs.getInt("testId"));
					testDto.setTestId(rs.getInt("testId"));
					testDto.setTestTitle(rs.getString("testTitle"));
					testDto.setCorrectionMethod(CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
					int maxAttempts = rs.getInt("maximum_attempts");
					int attemptCount = (rs.getInt("attemptCount"));
					int remainingAttempts = maxAttempts - attemptCount;
					testDto.setRemainingAttempts(remainingAttempts);
					testDto.setMaximumAttempts(maxAttempts);
					testDto.setCreatorName(rs.getString("creatorName"));
					testDto.setAttemptCount(attemptCount);
					if (rs.getBoolean("is_timed")) {
						testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					}
					this.tests.add(testDto);
                     
				}
			}
		}
		return tests;
	}
}
