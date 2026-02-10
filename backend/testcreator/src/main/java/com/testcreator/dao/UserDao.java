package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.testcreator.model.User;
import com.testcreator.util.Queries;


public class UserDao {
	private final Connection connection;

	public UserDao(Connection connection) {
		this.connection = connection;
	}
	
	public User getUserById(int userId) {
		try(PreparedStatement getUserById = connection.prepareStatement(Queries.getUserById)){
			getUserById.setInt(1, userId);
			
			try(ResultSet rs = getUserById.executeQuery()){
				if(rs.next()) {
					return new User(rs.getString("name"),rs.getInt("user_id"),rs.getString("email"),rs.getTimestamp("registered_at").toInstant());
				}
			}
			
		}catch (SQLException e) {
			// TODO: implement logger
		}
		
		return null;
	}	
	
	public int saveNewUser(String name,String email,String passwordHash) {
		int userId = -1;
		try(PreparedStatement insertUser = connection.prepareStatement(Queries.insertUser, Statement.RETURN_GENERATED_KEYS)){
			insertUser.setString(1, name);
			insertUser.setString(2, email);
			insertUser.setString(3, passwordHash);
			insertUser.executeUpdate();
			try(ResultSet rs = insertUser.getGeneratedKeys()){
				if(rs.next()) {
					userId = rs.getInt(1);
				}else {
					throw new SQLException("User Id not generated");
				}
			}
		}catch (SQLException e) {
			// TODO : Implement logger 
		}
		return userId;
	}
	
	
	public String getPasswordHash(String email){
		try(PreparedStatement getPassword = connection.prepareStatement(Queries.getUserPassword)){
			getPassword.setString(1 ,email);
			try(ResultSet rs = getPassword.executeQuery()){
				if(rs.next()) {
					return rs.getString("password_hash");
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}
		return null;
	}

	public User getUserByEmail(String email) {
		try(PreparedStatement getUser = connection.prepareStatement(Queries.getUserByEmail)){
			getUser.setString(1, email);
			
			try(ResultSet rs = getUser.executeQuery()){
				if(rs.next()) {
					return new User(rs.getString("name"),rs.getInt("user_id"),rs.getString("email"),rs.getTimestamp("registered_at").toInstant());
				}
			}
			
		}catch (SQLException e) {
			// TODO: implement logger
			
		}
		
		return null;
	}	
	
	public boolean isUserExists(String email) {
		try(PreparedStatement ps = connection.prepareStatement(Queries.getUserByEmail)){
			ps.setString(1, email);
			try(ResultSet rs = ps.executeQuery()){
				if(rs.next()) {
					System.out.println("Exists");
					return true;
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}
		return false;
	}
	
}
