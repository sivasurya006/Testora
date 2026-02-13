drop database if exists TestCreator_v1;

create database TestCreator_v1;

use TestCreator_v1;


create table Users (
    user_id int primary key auto_increment,
    name varchar(50) not null,
    email varchar(100) unique not null,
    password_hash varchar(255) not null,
    registered_at timestamp default current_timestamp
);

create table Classrooms (
    classroom_id int primary key auto_increment,
    created_by int not null,
    name varchar(50) not null,
    created_at timestamp default current_timestamp,
    public_code char(7) unique not null,
    foreign key (created_by) references Users(user_id) on delete cascade
);

create table Classroom_Users (    
    classroom_id int,
    user_id int,
    role enum ('tutor','student') not null,
    joined_at timestamp default current_timestamp,
    unique_key varchar(255) not null,

    primary key (classroom_id, user_id),

    foreign key (classroom_id) references Classrooms(classroom_id) on delete cascade,
    foreign key (user_id) references Users(user_id) on delete cascade
);

create table Tests (
    test_id int primary key auto_increment,
    classroom_id int not null,
    creator_id int not null,
    title varchar(100),
    correction_type enum('auto','manual') default 'auto',
    created_at timestamp default current_timestamp,
    is_timed boolean default false,
    duration_minutes int,
    status enum ('draft','published') default 'draft',
    maximum_attempts int default 0, 
    corrected_by int null,
    
    unique (creator_id,title,classroom_id),
    
    check (
  		(is_timed = false and duration_minutes is null)
  		or
  		(is_timed = true and duration_minutes > 0)
	),
	

    foreign key (classroom_id) references Classrooms(classroom_id) on delete cascade,
    foreign key (creator_id) references Users(user_id) on delete cascade,
    foreign key (corrected_by) references Users(user_id) on delete set null
);

create table Questions (
    question_id int primary key auto_increment,
    test_id int not null,
    type enum('mcq','single','boolean','fill_blank','matching') not null,
    question_text text not null,
    marks int default 0,

    foreign key (test_id) references Tests(test_id) on delete cascade
);


create table Options (
    option_id int primary key auto_increment,
    question_id int not null,
    option_text text not null,
    is_correct boolean default false,
    option_mark decimal(6,2) default 0,

    foreign key (question_id) references Questions(question_id) on delete cascade
);

create table Attempts (
    attempt_id int primary key auto_increment,
    test_id int not null,
    user_id int not null,
    
    started_at timestamp default current_timestamp,
    submitted_at timestamp,
    
    unique (test_id, user_id, attempt_id),

    status enum('started','submitted','evaluated') default 'started',
    marks decimal(6,2) default 0,

    foreign key (test_id) references Tests(test_id) on delete cascade,
    foreign key (user_id) references Users(user_id) on delete cascade
);

create table Answers (
    answer_id int primary key auto_increment,
    
    attempt_id int not null,
    question_id int not null,
    
    option_id int,
    is_correct boolean,
    
    given_marks decimal(6,2),
    
    unique (attempt_id, question_id),

    foreign key (attempt_id) references Attempts(attempt_id) on delete cascade,
    foreign key (question_id) references Questions(question_id) on delete cascade,
    foreign key (option_id) references Options(option_id) on delete set null
);

--create table Answer_Options (
--    answer_id int not null,
--    option_id int not null,
--
--    primary key (answer_id, option_id),
--    foreign key (answer_id) references Answers(answer_id) on delete cascade,
--    foreign key (option_id) references Options(option_id) on delete cascade
--);


--create table Fill_In_Blank_Answers(
--	blank_id int primary key auto_increment,
--	question_id int not null,
--	blank_idx  int not null,
--	blank_text text not null,
--	is_caseSensitive boolean default false,
--	foreign key (question_id) references Questions(question_id) on delete cascade
--);
--
--create table Matching_Answers(
--	match_id int primary key auto_increment,
--	question_id int not null,
--	left_side_text text not null,
--	right_side_text text not null,
--	foreign key (question_id) references Questions(question_id) on delete cascade
--);



 create index idx_attempt_status on Attempts(status);
 create index idx_attempt_test on Attempts(test_id);
 create index idx_answers_attempt on Answers(attempt_id);
 create index idx_tests_classroom on Tests(classroom_id);
 create index idx_questions_test on Questions(test_id);
 create index idx_options_question on Options(question_id);
 create index idx_answers_question on Answers(question_id);



-- Testing 

-- Register as a Tutor
-- name = Divya , email = divya@zohocorp.com   id = 1
-- 
-- Create a class Room named Advanced JS  id = 1
-- Creating a not timed test , correction type auto id = 2
-- +---------+--------------+------------+------------------+-----------------+---------------------+----------+------------------+
-- | test_id | classroom_id | creator_id | title            | correction_type | created_at          | is_timed | duration_minutes |
-- +---------+--------------+------------+------------------+-----------------+---------------------+----------+------------------+
-- |       2 |            1 |          1 | React Components | auto            | 2026-01-11 20:34:54 |        0 |             NULL |
-- +---------+--------------+------------+------------------+-----------------+---------------------+----------+------------------+



-- Try to add Questions 
-- 1) MCQ id = 2
-- +-------------+---------+------+----------------+-------+
-- | question_id | test_id | type | question_text  | marks |
-- +-------------+---------+------+----------------+-------+
-- |           2 |       2 | mcq  | What is React? |     2 |
-- +-------------+---------+------+----------------+-------+

-- Adding options
-- +-----------+-------------+----------------------+------------+
-- | option_id | question_id | option_text          | is_correct |
-- +-----------+-------------+----------------------+------------+
-- |         1 |           2 | FrameWork            |          0 |
-- |         2 |           2 | Library              |          1 |
-- |         3 |           2 | Programming language |          0 |
-- |         4 |           2 | Markup Language      |          0 |
-- +-----------+-------------+----------------------+------------+



-- Try to select the question with option
-- select title as TestName , question_text , marks  , type  from Tests t join Questions q on t.test_id = q.test_id where t.test_id = 2;
-- +------------------+----------------+-------+------+
-- | TestName         | question_text  | marks | type |
-- +------------------+----------------+-------+------+
-- | React Components | What is React? |     2 | mcq  |
-- +------------------+----------------+-------+------+

-- select option_text from Options where question_id = 2;
-- +----------------------+
-- | option_text          |
-- +----------------------+
-- | FrameWork            |
-- | Library              |
-- | Programming language |
-- | Markup Language      |
-- +----------------------+



-- Question 2 type single id = 3