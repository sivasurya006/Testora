package com.testcreator.actions;

import java.sql.Connection;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.util.ServletContextAware;

import com.testcreator.dto.ApiError;
import com.testcreator.service.StudentService;
import com.testcreator.util.DBConnectionMaker;

public class StudentAction extends JsonApiAction implements ServletContextAware {

    private ServletContext servletContext;

    private int classroomId;

    private List<String> studentNames;

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    public String studentsInClassroom() {

        if (classroomId <= 0) {
            setError(new ApiError("Invalid classroom id", 400));
            return INPUT;
        }

        try {
            Connection connection =
                DBConnectionMaker.getInstance(servletContext).getConnection();

            StudentService studentService = new StudentService(connection);
            this.studentNames =
                studentService.getStudentNamesByClassroomId(classroomId);

            return SUCCESS;

        } catch (Exception e) {
            e.printStackTrace();
        }

        setError(new ApiError("Unable to fetch students", 500));
        return ERROR;
    }

    public List<String> getStudentNames() {
        return studentNames;
    }

    public int getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(int classroomId) {
        this.classroomId = classroomId;
    }
}
