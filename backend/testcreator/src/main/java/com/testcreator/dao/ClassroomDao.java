package com.testcreator.dao;

import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.Instant;
import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.security.SecureRandom;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.Date;
import java.sql.NClob;
import java.sql.ParameterMetaData;
import java.sql.PreparedStatement;
import java.sql.Ref;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.RowId;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.util.List;

import com.testcreator.dto.ClassroomDto;
import com.testcreator.exception.ClassroomNotNoundException;
import com.testcreator.exception.UnauthorizedException;
import com.testcreator.model.Classroom;
import com.testcreator.model.ClassroomUser;
import com.testcreator.model.User;
import com.testcreator.model.UserRole;
import com.testcreator.util.ClassroomCodeGenerator;
import com.testcreator.util.Queries;

import java.util.Calendar;
import java.util.LinkedList;

public class ClassroomDao {
	private final Connection connection;

	public ClassroomDao(Connection connection) {
		this.connection = connection;
	}

	public Classroom createNewClassRoom(int createdBy, String name) {
		Classroom classroom = null;
		try {
			connection.setAutoCommit(false);

			try (PreparedStatement insertClassroom = connection.prepareStatement(Queries.insertClassroom,
					Statement.RETURN_GENERATED_KEYS);
					PreparedStatement insertClassroomUserRel = connection
							.prepareStatement(Queries.insertUserClassroomRelationship)) {

				insertClassroom.setInt(1, createdBy);
				insertClassroom.setString(2, name);

				String classCode;
				do {
					classCode = ClassroomCodeGenerator.generateId(7);
				} while (isClassCodeExists(classCode));

				insertClassroom.setString(3, classCode);
				insertClassroom.executeUpdate();
				int classroomId;
				try (ResultSet rs = insertClassroom.getGeneratedKeys()) {
					if (rs.next()) {
						classroomId = rs.getInt(1);
					} else {
						throw new SQLException("Failed to get classroom Id");
					}
				}

				insertClassroomUserRel.setInt(1, classroomId);
				insertClassroomUserRel.setInt(2, createdBy);
				insertClassroomUserRel.setString(3, UserRole.TUTOR.name().toLowerCase());
				insertClassroomUserRel.executeUpdate();

				try (PreparedStatement getCreatedAt = connection.prepareStatement(Queries.selectClassroomCreatedAt)) {
					getCreatedAt.setInt(1, classroomId);
					try (ResultSet rs = getCreatedAt.executeQuery()) {
						if (rs.next()) {
							Instant createdAt = rs.getTimestamp("created_at").toInstant();
							classroom = new Classroom(classroomId, createdBy, name, createdAt);
						}
					}
				}
				connection.commit();
			}

		} catch (SQLException e) {
			e.printStackTrace();
			try {
				connection.rollback();
			} catch (SQLException e1) {
				// TODO: implement logger
				e.printStackTrace();
			}
			return null;
		} finally {
			try {
				connection.setAutoCommit(true);
			} catch (SQLException e) {
				// TODO: implement logger
				e.printStackTrace();
			}
		}

		return classroom;
	}

	public boolean addStudent(int classroomId, int userId) throws SQLException {

		try (PreparedStatement insertClassroomUserRel = connection
				.prepareStatement(Queries.insertUserClassroomRelationship)) {
			insertClassroomUserRel.setInt(1, classroomId);
			insertClassroomUserRel.setInt(2, userId);
			insertClassroomUserRel.setString(3, UserRole.STUDENT.name().toLowerCase());
			return insertClassroomUserRel.executeUpdate() > 0;
		}
	}

	public List<ClassroomDto> getAllCreatedClassrooms(int createdBy) {
		List<ClassroomDto> classrooms = new LinkedList<>();
		try (PreparedStatement getCreatedClassrooms = connection.prepareStatement(Queries.selectCreatedClassrooms)) {
			getCreatedClassrooms.setInt(1, createdBy);
			try (ResultSet rs = getCreatedClassrooms.executeQuery()) {
				while (rs.next()) {

					ClassroomDto classroomDto = new ClassroomDto();
					classroomDto.setClassroomId(rs.getInt("classroom_id"));
					classroomDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					classroomDto.setCreatedBy(rs.getInt("created_by"));
					classroomDto.setClassroomName(rs.getString("name"));
					Integer totaTests = rs.getInt("total_tests");
					totaTests = totaTests == null ? 0 : totaTests;
					classroomDto.setTotalTests(totaTests);
					Integer totalStudents = rs.getInt("total_students");
					totalStudents = totalStudents == null ? 0 : totalStudents;
					classroomDto.setTotalStudents(totalStudents);
					classrooms.add(classroomDto);
				}
			}
		} catch (SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
		}

		return classrooms;
	}

	public List<ClassroomDto> getAllJoinedClassrooms(int userId) {
		List<ClassroomDto> classrooms = new LinkedList<>();
		try (PreparedStatement getCreatedClassrooms = connection.prepareStatement(Queries.selectJoinedClassrooms)) {
			getCreatedClassrooms.setInt(1, userId);
			try (ResultSet rs = getCreatedClassrooms.executeQuery()) {
				while (rs.next()) {

					ClassroomDto classroomDto = new ClassroomDto();
					classroomDto.setClassroomId(rs.getInt("classroom_id"));
					classroomDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					classroomDto.setCreatedBy(rs.getInt("created_by"));
					classroomDto.setClassroomName(rs.getString("name"));
					classroomDto.setJoinedAt(rs.getTimestamp("joined_at").toInstant().getEpochSecond());
					classroomDto.setCreatorName(rs.getString("c.name"));
					Integer totaTests = rs.getInt("total_published");
					totaTests = totaTests == null ? 0 : totaTests;
					classroomDto.setTotalTests(totaTests);
					Integer totalAttempted = rs.getInt("total_attempted");
					totalAttempted = totalAttempted == null ? 0 : totalAttempted;
					classroomDto.setTotalAttempted(totalAttempted);
					classrooms.add(classroomDto);
				}
			}
		} catch (SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
		}
		return classrooms;
	}

	public List<ClassroomUser> getAllStudents(int classroomId) {
		List<ClassroomUser> students = new LinkedList<>();
		try (PreparedStatement getStudents = connection.prepareStatement(Queries.selectClassroomStudents)) {
			getStudents.setInt(1, classroomId);
			try (ResultSet rs = getStudents.executeQuery()) {
				while (rs.next()) {
					User user = new User(rs.getString("name"), rs.getInt("user_id"), rs.getString("email"),
							rs.getTimestamp("registered_at").toInstant().getEpochSecond(), rs.getInt("totalTestsCount"),
							rs.getInt("attemptedTestsCount"));
					Instant joinedAt = rs.getTimestamp("joined_at").toInstant();

					students.add(new ClassroomUser(user, joinedAt.getEpochSecond(), UserRole.STUDENT));
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}

		System.out.println(students);
		return students;
	}

	public List<ClassroomUser> getAllTutors(int classroomId) {
		List<ClassroomUser> tutors = new LinkedList<>();
		try (PreparedStatement getStudents = connection.prepareStatement(Queries.selectClassroomTutors)) {
			getStudents.setInt(1, classroomId);
			try (ResultSet rs = getStudents.executeQuery()) {
				while (rs.next()) {
					User user = new User(rs.getString("name"), rs.getInt("user_id"), rs.getString("email"),
							rs.getTimestamp("registered_at").toInstant().getEpochSecond());
					Instant joinedAt = rs.getTimestamp("joined_at").toInstant();
					tutors.add(new ClassroomUser(user, joinedAt.getEpochSecond(), UserRole.TUTOR));
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}

		return tutors;
	}

	public boolean deleteClassroom(int userId, int classroomId) throws SQLException {

		try (PreparedStatement isAuthorized = connection
				.prepareStatement(Queries.selectClassroomByCreatedByAndClassroomId)) {

			isAuthorized.setInt(1, classroomId);
			isAuthorized.setInt(2, userId);

			try (ResultSet rs = isAuthorized.executeQuery()) {
				if (!rs.next()) {
					System.out.println("unautorized");
					throw new UnauthorizedException();
				} else {
					try (PreparedStatement deleteClass = connection.prepareStatement(Queries.deleteClassroom)) {
						deleteClass.setInt(1, classroomId);
						deleteClass.setInt(2, userId);

						if (deleteClass.executeUpdate() == 1) {
							System.out.println("deleted");
							return true;
						} else {
							throw new ClassroomNotNoundException();
						}
					}
				}
			}

		}
	}

	public boolean renameClassroom(int userId, int classroomId, String newName) throws SQLException {
		try (PreparedStatement isAuthorized = connection
				.prepareStatement(Queries.selectClassroomByCreatedByAndClassroomId)) {
			isAuthorized.setInt(1, classroomId);
			isAuthorized.setInt(2, userId);

			try (ResultSet rs = isAuthorized.executeQuery()) {
				if (!rs.next()) {
					System.out.println("Unauthorized access");
					throw new UnauthorizedException();
				} else {
					try (PreparedStatement updateClass = connection.prepareStatement(Queries.updateClassRoomName)) {
						updateClass.setString(1, newName);
						updateClass.setInt(2, classroomId);
						if (updateClass.executeUpdate() == 1) {
							System.out.println("updated");
							return true;
						} else {
							throw new ClassroomNotNoundException();
						}
					}
				}
			}
		}
	}

	public String getClassroomCode(int classroomId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.getClassPublicCode)) {
			ps.setInt(1, classroomId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getString(1);
				}
			}
		}
		return null;
	}

	public String changeClassroomCode(int classroomId) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.updateClassPublicCode)) {
			String classCode;
			do {
				classCode = ClassroomCodeGenerator.generateId(7);
			} while (isClassCodeExists(classCode));
			ps.setString(1, classCode);
			ps.setInt(2, classroomId);
			if (ps.executeUpdate() > 0) {
				return classCode;
			}
		}
		return null;
	}

	public ClassroomDto getClassroomPublicDetails(String code) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.selectClassroomPublicDetais)) {
			ps.setString(1, code);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					ClassroomDto classroomDto = new ClassroomDto();
					classroomDto.setClassroomName(rs.getString("name"));
					classroomDto.setCreatorName(rs.getString("creator_name"));
					return classroomDto;
				}
			}
		}
		return null;
	}

	public ClassroomDto getClassroom(int userId, int classroomId) {

		ClassroomDto classroomDto = null;

		try {

			PreparedStatement classroom = connection.prepareStatement(Queries.selectClassroomDetails);

			classroom.setInt(1, classroomId);
			classroom.setInt(2, userId);
			classroom.setInt(3, classroomId);

			try {
				ResultSet rs = classroom.executeQuery();
				while (rs.next()) {
					classroomDto = new ClassroomDto();
					classroomDto.setCreatedAt(rs.getTimestamp("created_at").toInstant().getEpochSecond());
					classroomDto.setClassroomName(rs.getString("classname"));
					classroomDto.setCreatorName(rs.getString("username"));
					classroomDto.setTotalStudents(rs.getInt("studentCount"));
					classroomDto.setTotalTests(rs.getInt("testCount"));

					System.out.println("creatorname" + rs.getString("username"));

				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (SQLException e) {
			// TODO Implement logger
			e.printStackTrace();
		}
		return classroomDto;
	}

	public int getClassroomId(String code) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.getClassrommIdByCode)) {
			ps.setString(1, code);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					return rs.getInt("classroom_id");
				}
			}
		}
		return 0;
	}

	private boolean isClassCodeExists(String code) throws SQLException {
		try (PreparedStatement ps = connection.prepareStatement(Queries.selectClassByPublicCode)) {
			ps.setString(1, code);
			if (ps.execute()) {
				try (ResultSet rs = ps.getResultSet()) {
					return rs.next();
				}
			}
			return false;
		}
	}

	public boolean deleteStudent(int userId, int classroomId) throws SQLException {

		try (PreparedStatement deleteClass = connection.prepareStatement(Queries.deleteStudent)) {
//			deleteClass.setInt(1, classroomId);
			System.out.println("user_id" + userId);
			deleteClass.setInt(1, userId);

			if (deleteClass.executeUpdate() == 1) {
				System.out.println("deleted");
				return true;
			} else {
				throw new ClassroomNotNoundException();
			}
		}

	}

	public List<ClassroomUser> getTopPerfomanceStudent(int classroomId) {
		List<ClassroomUser> topPerformers = new LinkedList<>();
		try (PreparedStatement getStudents = connection.prepareStatement(Queries.getTopPerfomanceStudents)) {
			getStudents.setInt(1, classroomId);
			try (ResultSet rs = getStudents.executeQuery()) {
				while (rs.next()) {

					topPerformers.add(new ClassroomUser(rs.getString("name"), rs.getInt("score")));
				}
			}
		} catch (SQLException e) {
			// TODO implement logger
			e.printStackTrace();
		}

		return topPerformers;
	}
}
