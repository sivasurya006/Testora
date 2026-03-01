package com.testcreator.service;

import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dao.UserDao;
import com.testcreator.exception.DatabaseConnectionException;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.model.User;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.util.PasswordUtil;

public class Userservice {

	private Connection connection;
	private ServletContext context;
	private UserDao userDao;
		
	public Userservice() {
		try {
			this.context = ServletActionContext.getServletContext();
			this.connection = DBConnectionMaker.getInstance(context).getConnection();
			this.userDao = new UserDao(connection);
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
			throw new DatabaseConnectionException(e.getMessage());
		}
	}
	
	public int signin(String email,String plainPassword) {
		int userId = -1;
		String storedHash = userDao.getPasswordHash(email);
		if(storedHash == null) {
			throw new UserNotFoundException("User not registered");
		}
		PasswordUtil passwordHash = new PasswordUtil(context);
		if(passwordHash.verifyPassword(plainPassword, storedHash)) {
			User user = userDao.getUserByEmail(email);
			if(user != null) {
				userId = user.getUserId();
			}
		}
		return userId;
	}
	
	public int signup(String name,String email,String plainPassword) {
		int userId = -1;
		if( ! userDao.isUserExists(email)) {
			String passwordHash = new PasswordUtil(context).getPasswordHash(plainPassword);
			userId =  userDao.saveNewUser(name, email, passwordHash);
		}
		return userId;
	}


	public User getUserDetails(int userId) {
		return userDao.getUserById(userId);
	}
	
}
