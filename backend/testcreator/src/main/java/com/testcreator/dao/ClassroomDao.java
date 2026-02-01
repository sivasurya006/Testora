package com.testcreator.dao;

import java.sql.Statement;
import java.time.Instant;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import com.testcreator.dto.ClassroomDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Classroom;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.User;
import com.testcreator.model.UserRole;
import com.testcreator.util.Queries;

import java.util.LinkedList;


public class ClassroomDao {
	private final Connection connection;
	
	public ClassroomDao(Connection connection) {
		this.connection = connection;
	}
	
	public Classroom createNewClassRoom(int createdBy,String name){
		Classroom classroom = null;
		try {
			connection.setAutoCommit(false);
			
			try(PreparedStatement insertClassroom = connection.prepareStatement(Queries.insertClassroom,Statement.RETURN_GENERATED_KEYS); 
				 PreparedStatement insertClassroomUserRel = connection.prepareStatement(Queries.insertUserClassroomRelationship)){
				
				
				insertClassroom.setInt(1, createdBy);
				insertClassroom.setString(2, name);
				insertClassroom.executeUpdate();
				
				int classroomId ;
				try(ResultSet rs = insertClassroom.getGeneratedKeys()){
					if(rs.next()) {
						classroomId = rs.getInt(1);			
					}else {
						throw new SQLException("Failed to get classroom Id");
					}
				}
				
				
				
				insertClassroomUserRel.setInt(1, classroomId);
				insertClassroomUserRel.setInt(2, createdBy);
				insertClassroomUserRel.setString(3, UserRole.TUTOR.name().toLowerCase());
				insertClassroomUserRel.executeUpdate();
				
				
				try(PreparedStatement getCreatedAt = connection.prepareStatement(Queries.selectClassroomCreatedAt)){
					getCreatedAt.setInt(1, classroomId);
					try(ResultSet rs = getCreatedAt.executeQuery()){
						if(rs.next()) {
							Instant createdAt = rs.getTimestamp("created_at").toInstant();
							classroom = new Classroom(classroomId, createdBy, name, createdAt);
						}
					}
				}
				connection.commit();	
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				connection.rollback();
			} catch (SQLException e1) {
				//  TODO: implement logger
				e.printStackTrace();
			}
			return null;
		}finally {
			try {
				connection.setAutoCommit(true);
			} catch (SQLException e) {
				// TODO: implement logger
				e.printStackTrace();
			}
		}
		
		return classroom;
	}
	
	
	public boolean addStudent(int classroomId,int userId) {
		
		try(PreparedStatement insertClassroomUserRel = connection.prepareStatement(Queries.insertUserClassroomRelationship)) {
			insertClassroomUserRel.setInt(1, classroomId);
			insertClassroomUserRel.setInt(2, userId);
			insertClassroomUserRel.setString(3, UserRole.STUDENT.name().toLowerCase());
			return insertClassroomUserRel.executeUpdate() > 0;
		}catch (SQLException e) {
			// TODO: implement logger
		}
		
		return false;
	}
	
	public List<ClassroomDto> getAllCreatedClassrooms(int createdBy){
		List<ClassroomDto> classrooms = new LinkedList<>();
		try(PreparedStatement getCreatedClassrooms = connection.prepareStatement(Queries.selectCreatedClassrooms)){
			getCreatedClassrooms.setInt(1, createdBy);
			try(ResultSet rs = getCreatedClassrooms.executeQuery()){
				while ( rs.next() ) {
					
					ClassroomDto classroomDto = new ClassroomDto();
					classroomDto.setClassroomId(rs.getInt("classroom_id"));
					classroomDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					classroomDto.setCreatedBy(rs.getInt("created_by"));
					classroomDto.setClassroomName(rs.getString("name"));
					classrooms.add(classroomDto);
				}
			}
		} catch (SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
		}
		
		return classrooms;
	}
	
	public List<ClassroomDto> getAllJoinedClassrooms(int userId){
		List<ClassroomDto> classrooms = new LinkedList<>();
		try(PreparedStatement getCreatedClassrooms = connection.prepareStatement(Queries.selectJoinedClassrooms)){
			getCreatedClassrooms.setInt(1, userId);
			try(ResultSet rs = getCreatedClassrooms.executeQuery()){
				while ( rs.next() ) {
					
					ClassroomDto classroomDto = new ClassroomDto();
					classroomDto.setClassroomId(rs.getInt("classroom_id"));
					classroomDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					classroomDto.setCreatedBy(rs.getInt("created_by"));
					classroomDto.setClassroomName(rs.getString("name"));

					classroomDto.setJoinedAt(rs.getTimestamp("joined_at").toInstant().getEpochSecond());
					
					classrooms.add(classroomDto);
				}
			}
		} catch (SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
		}
		
		return classrooms;
	}
	
	
	
	public List<ClassroomUser> getAllStudents(int classroomId){
		List<ClassroomUser> students = new LinkedList<>();
		try(PreparedStatement getStudents = connection.prepareStatement(Queries.selectClassroomStudents)){
			getStudents.setInt(1,classroomId);
			try(ResultSet rs = getStudents.executeQuery()){
				while(rs.next()) {
					User user = new User(rs.getString("name"),rs.getInt("user_id"), rs.getString("email"), rs.getTimestamp("registered_at").toInstant());
					Instant joinedAt = rs.getTimestamp("joined_at").toInstant();
					students.add(new ClassroomUser(user, joinedAt, UserRole.STUDENT));
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}
		
		return students;
	}
	
	
	public List<ClassroomUser> getAllTutors(int classroomId){
		List<ClassroomUser> tutors = new LinkedList<>();
		try(PreparedStatement getStudents = connection.prepareStatement(Queries.selectClassroomTutors)){
			getStudents.setInt(1,classroomId);
			try(ResultSet rs = getStudents.executeQuery()){
				while(rs.next()) {
					User user = new User(rs.getString("name"),rs.getInt("user_id"), rs.getString("email"), rs.getTimestamp("registered_at").toInstant());
					Instant joinedAt = rs.getTimestamp("joined_at").toInstant();
					tutors.add(new ClassroomUser(user, joinedAt, UserRole.TUTOR));
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}
		
		return tutors;
	}
	
	
	public boolean deleteClassroom(int userId, int classroomId) throws SQLException {
		
		try(PreparedStatement isAuthorized = connection.prepareStatement(Queries.selectClassroomByCreatedByAndClassroomId)){

			isAuthorized.setInt(1, classroomId);
			isAuthorized.setInt(2, userId);
			
			try(ResultSet rs = isAuthorized.executeQuery()){
				if(! rs.next()) {
					System.out.println("unautorized");
					throw new UnauthorizedException();
				}else {
					try(PreparedStatement deleteClass = connection.prepareStatement(Queries.deleteClassroom)){
						deleteClass.setInt(1, classroomId);
						deleteClass.setInt(2, userId);
						
						if(deleteClass.executeUpdate() == 1) {
							System.out.println("deleted");
							return true;
						}else {
							throw new ClassroomNotNoundException();
						}
					}
				}
			}
			
		}
	}
	
	
	public boolean renameClassroom(int userId,int classroomId, String newName) throws SQLException {	
		try(PreparedStatement isAuthorized = connection.prepareStatement(Queries.selectClassroomByCreatedByAndClassroomId)){
			isAuthorized.setInt(1, classroomId);
			isAuthorized.setInt(2, userId);
			
			try(ResultSet rs = isAuthorized.executeQuery()){
				if(! rs.next()) {
					System.out.println("Unauthorized access");
					throw new UnauthorizedException();
				}else {
					try(PreparedStatement updateClass = connection.prepareStatement(Queries.updateClassRoomName)){
						updateClass.setString(1, newName);
						updateClass.setInt(2, classroomId);
						if(updateClass.executeUpdate() == 1) {
							System.out.println("updated");
							return true;
						}else {
							throw new ClassroomNotNoundException();
						}
					}
				}
			}
		}
	}
	
}
