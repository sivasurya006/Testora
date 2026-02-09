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
	public static final String insertUser = "insert into Users (name,email,password_hash) values (?,?,?)";
	
	//read User
	public static final String getUserPassword = "select password_hash from Users where email = ?";
	public static final String getUserById = "select user_id, name, email, registered_at from Users where user_id = ?";
	public static final String getUserByEmail = "select user_id, name, email, registered_at from Users where email = ?";
	
	// update User
	public static final String updateUserPassword = "update Users set password_hash = ? where user_id = ?";
	public static final String updateUserName = "update Users set name = ? where user_id = ?";
	
	// delete User 
	public static final String deleteUser = "delete from Users where user_id = ?";
	
	/*============ Tests ==============*/
	
	// create Test
	public static final String insertTest = "insert into Tests (classroom_id,creator_id,title) values(?,?,?)";
	
	// Read Test
	public static final String selectTests = "select * from Tests where classroom_id = ? order by created_at desc";
	public static final String selectTestsWithLimit = "select * from Tests where classroom_id = ? order by created_at desc limit ? ";
	public static final String selectTestByTestID = "select * from Tests where test_id = ?";
	public static final String selectTestsByStatus = "select * from Tests where classroom_id = ? and status = ? order by created_at desc";
	public static final String selectTestsByStatusWithLimit = "select * from Tests where classroom_id = ? and status = ? order by created_at desc limit ? ";
	
	// update Test
	public static final String updateTestOptionsAndPublish_NotTimed = "update Tests set correction_type = ? , maximum_attempts = ? , status = 'published' where test_id = ?";
	public static final String updateTestOptionsAndPublish_Timed = "update Tests set correction_type = ? , duration_minutes = ? , maximum_attempts = ?  , is_timed = 1  , status = 'published'  where test_id = ?";
	public static final String renameTest = "update Tests set title = ? where test_id = ?";
	
	// delete Test
	public static final String deleteTest = "delete from Tests where test_id =  ?";
	
	/*=========== Questions and Options ==============*/
	
	// Create new Question
	public static final String insertQuestion = "insert into Questions (test_id,type,question_text,marks) values (?,?,?,?)"; 
	public static final String insertOption = "insert into Options (question_id,option_text,is_correct,option_mark) values (?,?,?,?)";
	
	
	// Read Questions 
	public static final String getQuestionWtthOptionsByQuestionId = "select * from Questions q join Options o on q.question_id = o.question_id where q.question_id = ?";
	
	

	public static final String deleteQuestion = "delete from Questions where question_id = ?";
	
	public static final String deleteOption = "delete from Options where option_id = ?";
	
	
	public static final String updateQuestion = "update Questions set question_text = ? , type = ? , marks = ? where question_id = ?";
	public static final String getAllQuestionsWithOptions = "select * from Tests t left join Questions q on t.test_id = q.test_id left join Options o on q.question_id = o.question_id where t.test_id = ?";
	
	public static final String updateOptions = "update Options set option_text = ?, is_correct = ? , option_mark = ? where option_id = ?";
	
	/* ============ Classroom users ===============*/
	
	public static final String selectClassroomUser = "select u.user_id, u.name, u.email, u.registered_at , cu.joined_at , cu.classroom_id , cu.role from Users u join Classroom_Users cu on u.user_id = cu.user_id  where cu.classroom_id = ? and cu.user_id = ?";
	
//	======= getClassroom=========
<<<<<<< HEAD
=======
//	public static final String selectClassroom=" select c.name, u.name , c.created_at from Classrooms c join Users u on created_by=user_id ";
>>>>>>> e092c5e632b983be09b6a160f4b45c6c691edfd2
	
	public static final String selectClassroom="select c.name as classname, u.name as username , c.created_at , count(cu.user_id) as studentCount from Classrooms c join Users u on created_by=user_id  left join Classroom_Users cu on c.classroom_id=cu.classroom_id and cu.role='student' where u.user_id=? and c.classroom_id=? group by c.classroom_id, c.name, u.name, c.created_at";
	public static final String selectTestCount="select count(t.test_id) as testCount  from Tests t join Classrooms c on t.classroom_id=c.classroom_id join Users u on u.user_id=t.creator_id where t.creator_id=?";
} 
