package com.testcreator.actions;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.util.ServletContextAware;

import com.opensymphony.xwork2.ActionSupport;
import com.testcreator.dao.ClassroomDao;
import com.testcreator.dto.ApiError;
import com.testcreator.model.Classroom;
import com.testcreator.service.ClassroomService;
import com.testcreator.service.Userservice;
import com.testcreator.util.DBConnectionMaker;

public class ClassroomAction extends JsonApiAction implements ServletContextAware {
	private ServletContext servletContext;
	
	private String classroomName;
	private long createdAt;
	private int classroomId;
	
	private List<Classroom> joinedClassrooms;
	private List<Classroom> createdClassrooms;
	
	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	
	public String createClassroom() {
		
		if(this.classroomName == null || this.classroomName.isBlank()) {
			setError(new ApiError("Invalid classroom name", 400));
			return INPUT;
		}
		
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if(userId <=0) {
			setError(new ApiError("Authentication failed", 401));
			return ERROR;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			Classroom classroom =  classroomService.createNewClassRoom(userId, classroomName);
			if(classroom == null) {
				setError(new ApiError("Can't create classroom", 500));
				return ERROR;
			}
			this.classroomId = classroom.getClassroomId();
			this.classroomName = classroom.getName();
			this.createdAt = classroom.getcreatedAt().toEpochMilli();
			return SUCCESS;
		} catch (Exception e) {
			// TODO implementLogger
			e.printStackTrace();
		}
	    setError(new ApiError("Can't create classroom", 500));
		return ERROR;
	}
	
	public String allCreatedClassrooms() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if(userId <=0) {
			setError(new ApiError("Authentication failed", 401));
			return ERROR;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			this.createdClassrooms = classroomService.getAllCreatedClassrooms(userId);
			return SUCCESS;
		}catch (Exception e) {
			// TODO implement logger
			e.printStackTrace();
		}
		setError(new ApiError("Can't get classrooms", 500));
		return ERROR;
	}
	
	
	public String allJoinedClassrooms() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = (int) request.getAttribute("userId");
		if(userId <=0) {
			setError(new ApiError("Authentication failed", 401));
			return ERROR;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			this.createdClassrooms = classroomService.getAllJoinedClassrooms(userId);
			return SUCCESS;
		}catch (Exception e) {
			// TODO implement logger
			e.printStackTrace();
		}
		setError(new ApiError("Can't get classrooms", 500));
		return ERROR;
	}
	
	public List<Classroom> getCreatedClassrooms() {
		return this.createdClassrooms;
	}
	public String getClassroomName() {
		return classroomName;
	}
	public void setClassroomName(String classroomName) {
		this.classroomName = classroomName;
	}
	public long getCreatedAt() {
		return createdAt;
	}
	public int getClassroomId() {
		return classroomId;
	}
	public ApiError getError() {
		return error;
	}

}
