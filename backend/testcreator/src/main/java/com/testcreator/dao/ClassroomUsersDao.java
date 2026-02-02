package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.struts2.ServletActionContext;

import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.User;
import com.testcreator.model.UserRole;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.util.Queries;

public class ClassroomUsersDao {
	private Connection connection;

	public ClassroomUsersDao() throws SQLException {
		try {
			this.connection = DBConnectionMaker.getInstance(ServletActionContext.getServletContext()).getConnection();
		}catch(ClassNotFoundException e) {
			throw new SQLException("Driver not found");
		}
	}
	
	public ClassroomUser getUser(int classroomId,int userId) throws SQLException {
		ClassroomUser classroomUser = null;
		
		try(PreparedStatement ps = connection.prepareStatement(Queries.selectClassroomUser)){
			ps.setInt(1, classroomId);
			ps.setInt(2, userId);
			try(ResultSet rs = ps.executeQuery()){
				if(rs.next()) {
					User user = new User(rs.getString("name"), rs.getInt("user_id") , rs.getString("email"), rs.getTimestamp("registered_at").toInstant());
					classroomUser = new ClassroomUser(user, rs.getTimestamp("joined_at").toInstant(), UserRole.valueOf(rs.getString("role").toUpperCase()));
					classroomUser.setClassroomId(rs.getInt("classroom_id"));
				}else {
					throw new ClassroomNotNoundException("can't find the classroom");
				}
			}
		}
		return classroomUser;
	}

}
