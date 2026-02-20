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
import com.testcreator.model.ClassroomUser;
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
	
	public String getClassroomCode(int classroomId) throws SQLException {
		return classroomDao.getClassroomCode(classroomId);
	}
	
	public String updateClassroomCode(int classroomId) throws SQLException {
		return classroomDao.changeClassroomCode(classroomId);
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
	
	public ClassroomDto getClassroomPublicDetails(String classroomCode) throws SQLException {
		return classroomDao.getClassroomPublicDetails(classroomCode);
	}
	
	public int addStudent(String publicCode,int userId) throws SQLException{
		int classroomId = classroomDao.getClassroomId(publicCode);
		if(classroomId > 0) {
			try {
				classroomDao.addStudent(classroomId, userId);
			} catch (SQLException e) {
				if(e.getErrorCode() == 1062) {
					return classroomId;
				}else {
					throw new SQLException(e);
				}
			}
		}
		return classroomId;
	}
	
	public List<ClassroomUser> getAllStudents(int classroomId){
		return classroomDao.getAllStudents(classroomId);
	}

	public boolean deleteStudent(int userId, int classroomId) throws SQLException {
		if(userId <=0 || classroomId <= 0) return false;
		return classroomDao.deleteStudent(userId, classroomId);
	}
}
