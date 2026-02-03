
	package com.testcreator.dao;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dto.TestDto;
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

			try (ResultSet rs = createTest.getGeneratedKeys()) {
				if (rs.next()) {
					testDto = new TestDto();
					testDto.setTestId(rs.getInt(1));
					testDto.setTestTitle(title);
					testDto.setCreatorId(creatorId);
					testDto.setClassroomId(classroomId);
				} else {
					throw new SQLException("Can't get auto generated id");
				}
			}
		}
		return testDto;
	}


}
