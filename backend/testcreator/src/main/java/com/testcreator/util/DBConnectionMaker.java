package com.testcreator.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import javax.servlet.ServletContext;

public class DBConnectionMaker {

	private Connection connection;
	private static DBConnectionMaker connectionMaker;

	private DBConnectionMaker(ServletContext context) throws SQLException, ClassNotFoundException {
		String url = (String) context.getAttribute("db.url");

		System.out.println("I am getting url : " + url);

		String user = (String) context.getAttribute("db.user");
		String password = (String) context.getAttribute("db.password");
		Class.forName("com.mysql.cj.jdbc.Driver");
		this.connection = DriverManager.getConnection(url, user, password);
	}

	private DBConnectionMaker() throws SQLException {
		String dbHost = System.getenv("DB_HOST");
		String dbPort = System.getenv("DB_PORT");
		String dbName = System.getenv("DB_NAME");
		String dbUser = System.getenv("DB_USER");
		String dbPassword = System.getenv("DB_PASSWORD");

		if (dbHost == null || dbPort == null || dbName == null || dbUser == null || dbPassword == null) {

			throw new RuntimeException("Missing DB environment variables");
		}

		String jdbcUrl = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?sslMode=REQUIRED";

		System.out.println("Connection url " + jdbcUrl);
		this.connection = DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
		System.out.println("New connection maked");
	}

	public static DBConnectionMaker getInstance(ServletContext context) throws ClassNotFoundException, SQLException {
		System.out.println("New connection maked");
		return new DBConnectionMaker(context);
	}

	public static DBConnectionMaker getInstance() throws SQLException {
//		if (connectionMaker == null) {
//			connectionMaker = new DBConnectionMaker();
//			System.out.println("New connection maked");
//		}
//		return connectionMaker;
		System.out.println("New connection maked");
		return new DBConnectionMaker();
	}

	public Connection getConnection() {

		System.out.println("One connection getted");
		return connection;
	}
}
