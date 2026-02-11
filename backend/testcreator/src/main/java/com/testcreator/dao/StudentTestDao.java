package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.TestDto;
import com.testcreator.model.CorrectionMethod;
import com.testcreator.model.TestStatus;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.util.Queries;

public class StudentTestDao {

	
	private Connection connection;

	public StudentTestDao() throws SQLException {
		try {
			this.connection = DBConnectionMaker.getInstance(ServletActionContext.getServletContext()).getConnection();
		} catch (ClassNotFoundException e) {
			throw new SQLException("Driver not found");
		}
	}
	
	
	public TestDto getNewTests(int classroomId,int userId) throws SQLException {
		TestDto testDto = null;
		try (PreparedStatement selectTest = connection.prepareStatement(Queries.selectStudentTests)) {
			selectTest.setInt(1,userId);
			try (ResultSet rs = selectTest.executeQuery()) {
				if (rs.next()) {
					testDto = new TestDto();
					testDto.setTestTitle(rs.getString("testTitle"));
					testDto.setCorrectionMethod(
							CorrectionMethod.valueOf(rs.getString("correction_type").toUpperCase()));
				
					testDto.setMaximumAttempts(rs.getInt("maximum_attempts"));
					testDto.setCreatorName(rs.getString("creatorName"));
					if(rs.getBoolean("is_timed")) {
						testDto.setDurationMinutes(rs.getInt("duration_minutes"));
					}

					
				} else {
					throw new SQLException("Can't get create test");
				}
			}
		}
		return testDto;
	}
}
