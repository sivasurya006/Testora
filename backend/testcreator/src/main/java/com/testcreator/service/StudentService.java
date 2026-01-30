package com.testcreator.service;

import java.sql.Connection;
import java.util.List;

import com.testcreator.dao.StudentDao;

public class StudentService {

    private StudentDao studentDao;

    public StudentService(Connection connection) {
        this.studentDao = new StudentDao(connection);
    }

    public List<String> getStudentNamesByClassroomId(int classroomId) {

        if (classroomId <= 0) {
            throw new IllegalArgumentException("Invalid classroom id");
        }

        return studentDao.fetchStudentNamesByClassroomId(classroomId);
    }
}
