package com.testcreator.service;

import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletContext;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dao.ClassroomDao;
import com.testcreator.dao.StudentListDao;
import com.testcreator.dao.UserDao;
import com.testcreator.exception.DatabaseConnectionException;
import com.testcreator.util.DBConnectionMaker;

public class StudentService {

    private StudentListDao StudentListDao;
   
	private Connection connection;
	private ServletContext context;
	
    public StudentService() {
    	try {
			this.context = ServletActionContext.getServletContext();
			this.connection = DBConnectionMaker.getInstance(context).getConnection();
			StudentListDao = new StudentListDao(connection);
		}catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			throw new DatabaseConnectionException(e.getMessage());
		}
	}	
		
    public List<String> getStudentNamesByClassroomId(int classroomId) {

        if (classroomId <= 0) {
            throw new IllegalArgumentException("Invalid classroom id");
        }

        return StudentListDao.fetchStudentNamesByClassroomId(classroomId);
    }
    
}
