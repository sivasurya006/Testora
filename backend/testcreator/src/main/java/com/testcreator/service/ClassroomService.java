package com.testcreator.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dao.ClassroomDao;
import com.testcreator.dao.UserDao;
import com.testcreator.dto.ClassroomDto;
import com.testcreator.exception.DatabaseConnectionException;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.model.Classroom;
import com.testcreator.model.User;
import com.testcreator.util.DBConnectionMaker;




public class ClassroomService {
	
	private final UserDao userDao;
	private final ClassroomDao classroomDao;
	private Connection connection;
	private ServletContext context;
	
	
	public ClassroomService() {
		try {
			this.context = ServletActionContext.getServletContext();
			this.connection = DBConnectionMaker.getInstance(context).getConnection();
			userDao = new UserDao(connection);
			classroomDao = new ClassroomDao(connection);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			throw new DatabaseConnectionException(e.getMessage());
		}
	}
	
	public Classroom createNewClassRoom(int creatorId,String name) {
		User user = userDao.getUserById(creatorId);
		if(user == null) {
			throw new UserNotFoundException("User not registered");
		}
		return classroomDao.createNewClassRoom(user.getUserId(), name);	
	}
	
	public List<ClassroomDto> getAllCreatedClassrooms(int userId){
		return classroomDao.getAllCreatedClassrooms(userId);
	}

	public List<ClassroomDto> getAllJoinedClassrooms(int userId){
		return classroomDao.getAllJoinedClassrooms(userId);
	}

	public boolean deleteClassRoom(int userId, int classroomId) throws SQLException {
		if(userId <=0 || classroomId <= 0) return false;
		return classroomDao.deleteClassroom(userId, classroomId);
	}
	
	public boolean updateClassroomName(int userId,int classroomId, String newName) throws SQLException {
		if(userId <=0 || classroomId <= 0) return false;
		return classroomDao.renameClassroom(userId, classroomId, newName);
	}
	
	public ClassroomDto getClassroom(int userId,int classroomId){
		return classroomDao.getClassroom(userId,classroomId);
		

	}
	
}
