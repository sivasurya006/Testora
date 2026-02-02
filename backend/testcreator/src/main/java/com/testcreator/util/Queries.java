package com.testcreator.util;

public class Queries {
	
	/* ========== Classroom ============= */
	// create classrooms
	public static final String  insertClassroom = "insert into Classrooms (created_by,name) values (?,?)";
	public static final String insertUserClassroomRelationship = "insert into Classroom_Users (classroom_id,user_id,role) values (?,?,?)";
	
	
	// read classrooms
	public static final String selectClassroomStudents = "select u.user_id , u.name , u.email , u.registered_at , cu.joined_at  from Users u join Classroom_Users cu on  u.user_id = cu.user_id where cu.classroom_id = ? and cu.role = 'student'";
	public static final String selectClassroomTutors = "select u.user_id , u.name , u.email , u.registered_at  , cu.joined_at  from Users u join Classroom_Users cu on  u.user_id = cu.user_id where cu.classroom_id = ? and cu.role = 'tutor'";
	public static final String selectCreatedClassrooms  = "select c.* , u.name as creator_name from Classrooms c join Users u on c.created_by = u.user_id where created_by = ?";
	
	public static final String selectJoinedClassrooms = "select c.classroom_id , c.name , c.created_by, u.name as creator_name "
														+ ",c.created_at  ,cu.joined_at from Classrooms c join Classroom_Users cu on c.classroom_id = cu.classroom_id"
														+ " join Users u on c.created_by = u.user_id  where cu.user_id = ? and cu.role = 'student'";
	
	public static final String selectClassroomCreatedAt = "select created_at from Classrooms where classroom_id = ?";
	public static final String selectClassroomByCreatedByAndClassroomId = "select * from Classrooms where classroom_id = ? and created_by = ?";
	
	//update classrooms
	public static final String updateClassRoomName = "update Classrooms set name = ? where classroom_id = ?"; 
	
	
	
	//delete classrooms
	public static final String deleteClassroom = "delete from Classrooms where classroom_id = ? and created_by = ?";
	
	/* ============ Users ===========*/
	
	// Create User
	public static final String insertUser = "insert into Users (name,email,password) values (?,?,?)";
	
	//read User
	public static final String getUserPassword = "select password from Users where email = ?";
	public static final String getUserById = "select user_id, name, email, registered_at from Users where user_id = ?";
	public static final String getUserByEmail = "select user_id, name, email, registered_at from Users where email = ?";
	
	// update User
	public static final String updateUserPassword = "update Users set password = ? where user_id = ?";
	public static final String updateUserName = "update Users set name = ? where user_id = ?";
	
	// delete User 
	public static final String deleteUser = "delete from Users where user_id = ?";
	
	/*============ Tests ==============*/
	
	// create Test
	public static final String insertTest = "insert into Tests (classroom_id,creator_id,title) values(?,?,?)";
	
	// Read Test
	public static final String selectTests = "select * from Tests where classroom_id = ? ";
	
	// update Test
	public static final String updateTestOptionsAndPublish_NotTimed = "update Tests set correction_type = ? , maximumAttempts = ? , status = 'published' where test_id = ?";
	public static final String updateTestOptionsAndPublish_Timed = "update Tests set correction_type = ? , duration_minutes = ? , maximumAttempts = ?  , is_timed = 1  , status = 'published'  where test_id = ?"; 
	
	// delete Test
	public static final String deleteTest = "delete from Test where test_id =  ?";
	
	/*=========== Questions and Options ==============*/
	
	// Create new Question
	public static final String insertQuestion = "insert into Questions (test_id,type,question_text,marks) values (?,?,?,?)"; 
	
	
} 
