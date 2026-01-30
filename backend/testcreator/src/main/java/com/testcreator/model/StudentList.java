package com.testcreator.model;

public class StudentList {
     public int studentId;
     public String studentName;
     public StudentList(int StudentId,String studentName) {
    	 this.studentName=studentName;
     }
	 public int getStudentId() {
		 return studentId;
	 }
	 
	 public void setStudentId(int studentId) {
		 this.studentId = studentId;
	 }
	 
	 public String getStudentName() {
		 return studentName;
	 }
	 
	 public void setStudentName(String studentName) {
		 this.studentName = studentName;
	 }
	 
}
