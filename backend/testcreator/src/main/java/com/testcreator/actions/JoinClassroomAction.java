package com.testcreator.actions;

import java.net.http.HttpRequest;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ModelDriven;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.ClassroomDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.service.ClassroomService;

public class JoinClassroomAction extends JsonApiAction implements ServletRequestAware ,  ModelDriven<ClassroomDto>{
	
	private ClassroomDto classroomDto;
	private HttpServletRequest request;
	
	
	public void validate() {
		if(classroomDto == null) {
			addFieldError("classroomDto", "Values Not provided");
			return;
		}
		if(classroomDto.getCode() == null || classroomDto.getCode().isBlank()) {
			addFieldError("code", "invalid classcode");
		}
	}
	
	public String getClassroom() {
		try {
			ClassroomService classroomService = new ClassroomService();
			this.classroomDto = classroomService.getClassroomPublicDetails(classroomDto.getCode());
			return SUCCESS;
		}catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
	}
	
	
	public String joinClassroom() {
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		try {
			ClassroomService classroomService = new ClassroomService();
			int classId = classroomService.addStudent(classroomDto.getCode(), userId);
			this.classroomDto = new ClassroomDto();
			classroomDto.setClassroomId(classId);
			return SUCCESS;
		}catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
		
	}
	public ClassroomDto getClassroomDto() {
		return classroomDto;
	}

	public void setClassroomDto(ClassroomDto classroomDto) {
		this.classroomDto = classroomDto;
	}

	@Override
	public ClassroomDto getModel() {
		if (classroomDto == null) {
	        classroomDto = new ClassroomDto();
	    }
	    return classroomDto;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
	
	
	
}
