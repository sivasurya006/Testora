package com.testcreator.util;

public class Queries {
	
	/* ========== Classroom ============= */
	// create classrooms
	public static final String  insertClassroom = "insert into Classrooms (created_by,name,public_code) values (?,?,?)";
	public static final String insertUserClassroomRelationship = "insert into Classroom_Users (classroom_id,user_id,role) values (?,?,?)";
	public static final String selectClassByPublicCode = "select 1 from Classrooms where public_code = ?";
	public static final String getClassPublicCode = "select public_code from Classrooms where classroom_id = ?";
	public static final String updateClassPublicCode = "update Classrooms set public_code = ? where classroom_id = ?";
	
	// read classrooms
	public static final String selectClassroomStudents = "select  u.user_id , u.name , u.email , u.registered_at , cu.joined_at, count(distinct t.test_id) as totalTestsCount, count(distinct a.test_id) as attemptedTestsCount from Users u join Classroom_Users cu on  u.user_id = cu.user_id join Tests t on t.classroom_id=cu.classroom_id join Attempts a on t.test_id=a.test_id where cu.classroom_id = ? and cu.role = 'student' and t.status='published' and a.status='submitted' group by u.name,u.user_id ;";
	public static final String selectClassroomTutors = "select u.user_id , u.name , u.email , u.registered_at  , cu.joined_at  from Users u join Classroom_Users cu on  u.user_id = cu.user_id where cu.classroom_id = ? and cu.role = 'tutor'";
	public static final String selectCreatedClassrooms  = "select c.* , count(distinct t.test_id) as total_tests , count(distinct cu.user_id) as total_students from Classrooms c left join Tests t on t.classroom_id = c.classroom_id and t.status = 'published' left join Classroom_Users cu on cu.classroom_id = c.classroom_id and cu.role = 'student'  where created_by = ? group by  c.classroom_id";
	
	public static final String selectJoinedClassrooms = "select c.* , cu.joined_at , count(distinct t.test_id) as total_published , count(distinct a.test_id) as total_attempted from Classrooms c join Classroom_Users cu on c.classroom_id = cu.classroom_id left join Tests t on t.classroom_id = c.classroom_id and t.status = 'published' left join Attempts a on a.test_id = t.test_id and a.user_id = cu.user_id  where cu.user_id = ? and cu.role = 'student' group by c.classroom_id;";
	
	public static final String selectClassroomCreatedAt = "select created_at from Classrooms where classroom_id = ?";
	public static final String selectClassroomByCreatedByAndClassroomId = "select * from Classrooms where classroom_id = ? and created_by = ?";
	public static final String selectClassroomPublicDetais = " select u.name as creator_name  , c.name from Classrooms c join Users u on c.created_by = u.user_id where c.public_code = ?";
	public static final String getClassrommIdByCode = " select classroom_id  from Classrooms where public_code = ?";
	
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
	public static final String isTestPublished = "select 1 from Tests where test_id = ? and status = 'published'";

	
	// update Test
	public static final String updateTestOptionsAndPublish_NotTimed = "update Tests set correction_type = ? , maximum_attempts = ? , status = 'published' where test_id = ?";
	public static final String updateTestOptionsAndPublish_Timed = "update Tests set correction_type = ?  , maximum_attempts = ? , duration_minutes = ? , is_timed = 1  , status = 'published'  where test_id = ?";
	public static final String renameTest = "update Tests set title = ? where test_id = ?";
	public static final String unPublishTest = "update Tests set status='draft' where test_id = ?";
	// delete Test
	public static final String deleteTest = "delete from Tests where test_id =  ?";
	
	/*=========== Questions and Options ==============*/
	
	// Create new Question
	public static final String insertQuestion = "insert into Questions (test_id,type,question_text,marks) values (?,?,?,?)"; 
	public static final String insertOption = "insert into Options (question_id,option_text,is_correct,option_mark,properties) values (?,?,?,?,?)";
	
	
	// Read Questions 
	public static final String getQuestionWtthOptionsByQuestionId = "select * from Questions q join Options o on q.question_id = o.question_id where q.question_id = ?";
	
	

	public static final String deleteQuestion = "delete from Questions where question_id = ?";
	
	public static final String deleteOption = "delete from Options where option_id = ?";
	
	
	public static final String updateQuestion = "update Questions set question_text = ? , type = ? , marks = ? where question_id = ?";
	public static final String getAllQuestionsWithOptions = "select * from Questions q left join Options o on q.question_id = o.question_id where q.test_id = ?";
	
	public static final String updateOptions = "update Options set option_text = ?, is_correct = ? , option_mark = ? , properties = ? where option_id = ?";
	
	/* ============ Classroom users ===============*/
	
	public static final String selectClassroomUser = "select u.user_id, u.name, u.email, u.registered_at , cu.joined_at , cu.classroom_id , cu.role from Users u join Classroom_Users cu on u.user_id = cu.user_id  where cu.classroom_id = ? and cu.user_id = ?";
	
//	======= getClassroom=========

//	public static final String selectClassroom=" select c.name, u.name , c.created_at from Classrooms c join Users u on created_by=user_id ";

	
	public static final String selectClassroomDetails="select c.name as classname,u.name  as  username,c.created_at as created_at, count(distinct t.test_id) as testCount  , (select count(distinct user_id) from Classroom_Users where role=\"student\" and classroom_id=? ) as studentCount from Classrooms c left join Tests t on t.classroom_id = c.classroom_id  left join Classroom_Users cu on cu.classroom_id = c.classroom_id join Users u on u.user_id=c.created_by  where c.created_by = ? and c.classroom_id = ?  group by c.name,u.name,c.created_at;";
	public static final String selectTestCount="select count(test_id) as testCount  from Tests where classroom_id = ?";
	public static final String selectStudentTests="select  t.test_id as testId ,t.title as testTitle, t.is_timed, t.duration_minutes, t.creator_id, t.maximum_attempts,  t.correction_type,t.classroom_id, u.name as creatorName, COUNT(a.attempt_id) as attemptCount from Tests t join Users u    on u.user_id = t.creator_id left join Attempts a    on a.test_id = t.test_id  and  a.user_id=? where t.classroom_id=? and t.status='published' group by  t.test_id,  t.title,    t.is_timed,   t.duration_minutes,   t.maximum_attempts,  t.correction_type,  u.name;";
	public static final String getDashBoardAnaliticsData="select count(distinct user_id) as AttemptedStudentCountOnTest , t.title from Tests t left join Attempts a on t.test_id=a.test_id and a.status='submitted' and t.status='published' where t.classroom_id=? group by t.title, t.test_id order by AttemptedStudentCountOnTest desc;";
	public static final String getTopPerformingData="select distinct u.name, a.marks from Tests t join Classroom_Users cu on t.classroom_id=cu.classroom_id and cu.role='student' join Users u on u.user_id=cu.user_id join Attempts a on a.user_id = u.user_id where cu.classroom_id=10;";
	public static final String deleteStudent="delete from Students where user_id = ?";

	// Student Test Questions And Answers
	
	public static final String getTestQuestionsWithAttempt = "select title , is_timed , duration_minutes, q.question_id ,"
			+ " q.type , question_text , option_id , option_text , properties from Tests t "
			+ "left join Questions q on q.test_id = t.test_id left join Options o on q.question_id = o.question_id where t.test_id = ?";
	
	public static final String newAttempt = "insert Attempts (test_id,user_id) values (?,?)";
	public static final String getMaxAndUserAttempts = "select maximum_attempts , count(attempt_id) as user_attempts  from Tests t left join Attempts a on t.test_id = a.test_id where t.test_id = ? and user_id = ?";
	
	
	public static final String insertAnswer = "insert into Answers (attempt_id,question_id,option_id,properties) values (?,?,?,?)";
	public static final String getActveAttempt = "select attempt_id, test_id, user_id, started_at, submitted_at, status, marks from Attempts where test_id = ? and user_id = ? order by started_at desc limit 1";
	public static final String getDurationMinutes = "select duration_minutes, is_timed from Tests where test_id = ?";
	
	public static final String updateAttemptStatus = "update Attempts set status = 'submitted', submitted_at = now() where attempt_id = ?";
	public static final String updateAttemptStatusByEvaluated = "update Attempts set status = 'evaluated' , marks = ?  where attempt_id = ?";
	
	public static final String getQuestions = "select t.correction_type , t.title , q.question_id, q.type, o.option_id , o.is_correct , q.marks, o.option_mark , q.question_text , o.option_text , o.properties from Tests t left join Questions q on q.test_id = t.test_id  left join Options o on q.question_id = o.question_id where q.test_id = ?"; 
	public static final String getAnswer = "select question_id , option_id , answer_id , properties from Answers where attempt_id = ?";
	public static final String updateAnswer = "update Answers set is_correct = ?, given_marks = ? where answer_id = ?";
	
	
	public static final String getSubmissionsWithAttempts = "select a.user_id , u.name , u.email , a.test_id , t.title , count(a.attempt_id) as attempts_count  from Users u join Classroom_Users cu on u.user_id = cu.user_id join Tests t on t.classroom_id = cu.classroom_id join Attempts a on a.test_id  = t.test_id and a.user_id = cu.user_id and a.status = 'submitted' where cu.classroom_id = ?   group by  u.name , u.email , t.title , a.test_id , a.user_id order by attempts_count desc";
	public static final String getTestSubmissionDetails = "select u.user_id  , u.name , u.email , count(a.attempt_id) as total_attempts , sum(a.status = 'evaluated') as evaluated , sum(a.status = 'submitted') as submitted  from Users u join Classroom_Users cu on u.user_id = cu.user_id join Tests t on t.classroom_id = cu.classroom_id"
			+ "  left join Attempts a on a.user_id = cu.user_id and a.test_id = t.test_id where cu.classroom_id = ? and t.test_id = ? group by u.name , u.user_id , u.email order by total_attempts desc";
	
} 
