package com.testcreator.service;

import com.testcreator.model.Permission;
import com.testcreator.model.UserRole;

import java.sql.SQLException;

import com.testcreator.dao.ClassroomUsersDao;
import com.testcreator.dao.TestDao;
import com.testcreator.exception.MaximumAttemptsException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.Context;

public class AccessService {
	
	private final ClassroomUsersDao classroomUserDao;
	
	public AccessService() throws SQLException {
		classroomUserDao = new ClassroomUsersDao();
	}
	
	public void require(Permission permission, Context context) throws SQLException { 
		if(!hasPermission(permission, context)) {
			if(permission == Permission.ATTEMPTS_REMAINING) {
				throw new MaximumAttemptsException();
			}
			throw new UnauthorizedException();
		}
	}

	private boolean hasPermission(Permission permission,Context context) throws SQLException {
		
		switch (permission) {
		
		case CLASSROOM_STUDENT: {
			ClassroomUser classroomUser = classroomUserDao.getUser(context.getClasssroomId(), context.getUserId());
			return classroomUser != null && classroomUser.getRole() == UserRole.STUDENT;
		}
		case CLASSROOM_TUTOR : {
			ClassroomUser classroomUser = classroomUserDao.getUser(context.getClasssroomId(), context.getUserId());
			return classroomUser != null && classroomUser.getRole() == UserRole.TUTOR;
		}
		case CLASSROOM_MEMBER : {
			ClassroomUser classroomUser = classroomUserDao.getUser(context.getClasssroomId(), context.getUserId());
			return classroomUser != null;
		}
		case PUBLISHED_TEST : {
			return new TestDao().isPublished(context.getTestId());
		}
		case ATTEMPTS_REMAINING : {
			return hasRemainingAttempts(context);
		}
		default:
			return false;
		}
	}
	
	private boolean hasRemainingAttempts(Context context) throws SQLException {
		Context attemptsDetais = new TestDao().getMaxAndUserAttempts(context.getTestId(),context.getUserId());
		if(attemptsDetais == null) {
			return false;
		}
		int userAtempts = attemptsDetais.getUserTestAttempts();
		int maxAttempts = attemptsDetais.getMaximumTestAttempts();
		return maxAttempts == 0 || userAtempts < maxAttempts;
	}
}
