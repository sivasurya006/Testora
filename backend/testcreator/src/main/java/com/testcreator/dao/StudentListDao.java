

package com.testcreator.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.testcreator.util.Queries;

public class StudentListDao {

    private Connection connection;

    public StudentListDao(Connection connection) {
        this.connection = connection;
    }

    public List<String> fetchStudentNamesByClassroomId(int classroomId) {

        List<String> studentNames = new ArrayList<>();

       

        try (PreparedStatement ps = connection.prepareStatement(Queries.deleteClassroom)) {

            ps.setInt(1, classroomId);

            try (ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    studentNames.add(rs.getString("name"));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return studentNames;
    }
}

