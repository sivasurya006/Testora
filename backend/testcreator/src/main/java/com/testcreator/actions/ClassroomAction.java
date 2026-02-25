package com.testcreator.actions;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.util.ServletContextAware;

import com.testcreator.dao.ClassroomDao;
import com.testcreator.dto.ApiError;
import com.testcreator.dto.ClassroomDto;
import com.testcreator.dto.SuccessDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.model.Classroom;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.Context;
import com.testcreator.model.Permission;
import com.testcreator.service.AccessService;
import com.testcreator.service.ClassroomService;

public class ClassroomAction extends JsonApiAction implements ServletContextAware, ServletRequestAware {

	private ServletContext servletContext;
	private String classroomName;
	private HttpServletRequest request;

	private long createdAt;
	private int classroomId;

	private ClassroomDto classroomDto;
	private SuccessDto successDto;

	private List<ClassroomDto> joinedClassrooms;
	private List<ClassroomDto> createdClassrooms;
	private List<ClassroomUser> classroomUsers;

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}

	public String createClassroom() {

		if (this.classroomName == null || this.classroomName.isBlank()) {
			setError(new ApiError("Invalid classroom name", 400));
			return INPUT;
		}

		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if (userId <= 0) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			Classroom classroom = classroomService.createNewClassRoom(userId, classroomName);
			if (classroom == null) {
				setError(new ApiError("Can't create classroom", 500));
				return ERROR;
			}

			this.classroomDto = new ClassroomDto();
			classroomDto.setClassroomId(classroom.getClassroomId());
			classroomDto.setClassroomName(classroom.getName());
			;
			classroomDto.setCreatedAt(classroom.getcreatedAt().getEpochSecond());
			classroomDto.setCreatedBy(classroom.getcreatedBy());

			return SUCCESS;
		} catch (UserNotFoundException e) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		} catch (Exception e) {
			e.printStackTrace();
		}
		setError(new ApiError("Can't create classroom", 500));
		return ERROR;
	}

	public String allCreatedClassrooms() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if (userId <= 0) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			this.createdClassrooms = classroomService.getAllCreatedClassrooms(userId);
			return SUCCESS;
		} catch (Exception e) {
			// TODO implement logger
			e.printStackTrace();
		}
		setError(new ApiError("Can't get classrooms", 500));
		return ERROR;
	}

	public String allJoinedClassrooms() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		if (userId <= 0) {
			setError(new ApiError("Authentication failed", 401));
			return LOGIN;
		}
		try {
			ClassroomService classroomService = new ClassroomService();
			this.joinedClassrooms = classroomService.getAllJoinedClassrooms(userId);
			return SUCCESS;
		} catch (Exception e) {
			// TODO implement logger
			e.printStackTrace();
		}
		setError(new ApiError("Can't get classrooms", 500));
		return ERROR;
	}

	public String deleteClassroom() {

		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		String classroomIdHeader = request.getHeader("X-ClassroomId");

		if (classroomIdHeader == null) {
			setError(new ApiError("ClassroomId not provided", 400));
			return INPUT;
		}

		this.classroomId = Integer.parseInt(classroomIdHeader);

		if (classroomId <= 0) {
			setError(new ApiError("Invalid classroom id", 400));
			return INPUT;
		}

		try {
			ClassroomService classroomService = new ClassroomService();
			if (classroomService.deleteClassRoom(userId, classroomId)) {

				this.successDto = new SuccessDto("Classroom deleted sucessfully", 200, true);
				return SUCCESS;
			} else {
				this.successDto = new SuccessDto("Classroom not deleted", 422, false);
				return SUCCESS;
			}

		} catch (UnauthorizedException e) {
			setError(new ApiError("Authendication failed", 401));
			return LOGIN;
		} catch (Exception e) {
			e.printStackTrace();
			setError(new ApiError("Server error", 500));
		}
		return ERROR;
	}

	public String renameClassroom() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		String classroomIdHeader = request.getHeader("X-ClassroomId");

		if (classroomIdHeader == null || classroomIdHeader.isBlank()) {
			setError(new ApiError("ClassroomId not provided", 400));
			return INPUT;
		}

		this.classroomId = Integer.parseInt(classroomIdHeader);

		if (classroomId <= 0) {
			setError(new ApiError("Invalid classroom id", 400));
			return INPUT;
		}

		if (this.classroomName == null || this.classroomName.trim().length() == 0) {
			setError(new ApiError("Invalid classroom name", 400));
			return INPUT;
		}

		try {
			ClassroomService classroomService = new ClassroomService();
			if (classroomService.updateClassroomName(userId, classroomId, classroomName)) {
				this.successDto = new SuccessDto("Classroom renamed sucessfully", 200, true);
			} else {
				this.successDto = new SuccessDto("Classroom not renamed", 422, false);
			}
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authendication failed", 401));
			return LOGIN;
		} catch (SQLException e) {
			e.printStackTrace();
			setError(new ApiError("Server error", 500));
		}
		return ERROR;

	}

	public String getClassroomDetails() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt((String) request.getAttribute("userId"));
		System.out.println("user id:" + userId);
		String classroomIdHeader = request.getHeader("X-ClassroomId");

		if (classroomIdHeader == null || classroomIdHeader.isBlank()) {
			setError(new ApiError("ClassroomId not provided", 400));
			return INPUT;
		}

		this.classroomId = Integer.parseInt(classroomIdHeader);

		if (classroomId <= 0) {
			setError(new ApiError("Invalid classroom id", 400));
			return INPUT;
		}

		try {
			ClassroomService classroomService = new ClassroomService();
			this.classroomDto = classroomService.getClassroom(userId, classroomId);
			return SUCCESS;
		} catch (UnauthorizedException e) {
			e.printStackTrace();
		}
		return ERROR;
	}

	public String inviteLink() {

		HttpServletRequest request = ServletActionContext.getRequest();
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.classroomDto = new ClassroomDto();
			this.classroomDto.setCode(new ClassroomService().getClassroomCode(classroomId));
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public String updateInviteLink() {

		HttpServletRequest request = ServletActionContext.getRequest();
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);
			this.classroomDto = new ClassroomDto();
			this.classroomDto.setCode(new ClassroomService().updateClassroomCode(classroomId));
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public String fetchClassroomStudents() {
		int classroomId = (Integer) (request.getAttribute("classroomId"));
		int userId = Integer.parseInt((String) request.getAttribute("userId"));

		System.out.println(classroomId + " " + userId);

		try {
			Context context = new Context();
			context.setClasssroomId(classroomId);
			context.setUserId(userId);
			new AccessService().require(Permission.CLASSROOM_TUTOR, context);

			this.classroomUsers = new ClassroomService().getAllStudents(classroomId);
			return SUCCESS;
		} catch (UnauthorizedException e) {
			setError(new ApiError("Authentication failed", 401));
			e.printStackTrace();
			return LOGIN;
		} catch (ClassroomNotNoundException e) {
			setError(new ApiError("No record match", 404));
			return NOT_FOUND;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		setError(new ApiError("server error", 500));
		return ERROR;
	}

	public String deleteStudent() {
		HttpServletRequest request = ServletActionContext.getRequest();
		int userId = Integer.parseInt(request.getParameter("studentId"));
		String classroomIdHeader = request.getHeader("X-ClassroomId");
		System.out.println(classroomIdHeader);
		System.out.println(userId);

		if (classroomIdHeader == null) {

			setError(new ApiError("ClassroomId not provided", 400));
			return INPUT;
		}

		this.classroomId = Integer.parseInt(classroomIdHeader);

		if (classroomId <= 0) {

			setError(new ApiError("Invalid classroom id", 400));
			return INPUT;
		}

		try {

			ClassroomService classroomService = new ClassroomService();

			if (classroomService.deleteStudent(userId, classroomId)) {

				this.successDto = new SuccessDto("Classroom deleted sucessfully", 200, true);
				return SUCCESS;
			} else {
				this.successDto = new SuccessDto("Classroom not deleted", 422, false);
				return SUCCESS;
			}

		} catch (UnauthorizedException e) {
			System.out.println("in server error");

			setError(new ApiError("Authendication failed", 401));
			return LOGIN;
		} catch (Exception e) {
			System.out.println("in server error");
			e.printStackTrace();
			setError(new ApiError("Server error", 500));
		}
		return ERROR;
	}

	public String getTopPerfomanceStudents() {
		HttpServletRequest request = ServletActionContext.getRequest();
		String classroomIdHeader = request.getHeader("X-ClassroomId");

		if (classroomIdHeader == null) {

			setError(new ApiError("ClassroomId not provided", 400));
			return INPUT;
		}

		this.classroomId = Integer.parseInt(classroomIdHeader);

		if (classroomId <= 0) {

			setError(new ApiError("Invalid classroom id", 400));
			return INPUT;
		}

		try {

			ClassroomService classroomService = new ClassroomService();

			this.classroomUsers=classroomService.getTopPerfomanceStudent(classroomId);

			this.successDto = new SuccessDto("Classroom deleted sucessfully", 200, true);
			return SUCCESS;

		} catch (UnauthorizedException e) {
			System.out.println("in server error");

			setError(new ApiError("Authendication failed", 401));
			return LOGIN;
		} catch (Exception e) {
			System.out.println("in server error");
			e.printStackTrace();
			setError(new ApiError("Server error", 500));
		}
		return ERROR;

	}

	public SuccessDto getSuccessDto() {
		return successDto;
	}

	public List<ClassroomDto> getCreatedClassrooms() {
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

	public ClassroomDto getClassroomDto() {
		return classroomDto;
	}

	public List<ClassroomDto> getJoinedClassrooms() {
		return joinedClassrooms;
	}

	public List<ClassroomUser> getClassroomUsers() {
		return classroomUsers;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
