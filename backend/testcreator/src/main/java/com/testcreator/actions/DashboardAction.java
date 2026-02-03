package com.testcreator.actions;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.util.ServletContextAware;

import com.testcreator.dto.ApiError;
import com.testcreator.dto.ClassroomDto;
import com.testcreator.service.DashboardService;

public class DashboardAction extends JsonApiAction implements ServletContextAware{
    private ServletContext servletContext;
	private ClassroomDto classroomDto;

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
		
	}
	
	public String classroomDashboard() {
	    HttpServletRequest request = ServletActionContext.getRequest();
	    int userId = Integer.parseInt((String) request.getAttribute("userId"));
	    String classroomIdHeader = request.getHeader("X-classroomid");
	    System.out.println(userId);
	    System.out.println(classroomIdHeader);
	    if(classroomIdHeader == null) {
	        setError(new ApiError("ClassroomId not provided", 400));
	        return INPUT;
	    }

	    int classroomId = Integer.parseInt(classroomIdHeader);

	    try {
	        ClassroomDto dto = service.getDashboardData(userId, classroomId);
	        this.classroomDto = dto; 
	        return SUCCESS;
	    } catch(Exception e) {
	        e.printStackTrace();
	        setError(new ApiError("Server error", 500));
	        return ERROR;
	    }
	}

}
