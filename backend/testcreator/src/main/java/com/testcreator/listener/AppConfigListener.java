package com.testcreator.listener;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Application Lifecycle Listener implementation class AppConfigListener
 *
 */
@WebListener
public class AppConfigListener implements ServletContextListener {

	public AppConfigListener() {

	}

	public void contextDestroyed(ServletContextEvent sce) {

	}
	@Override
	public void contextInitialized(ServletContextEvent sce) {

	    ServletContext context = sce.getServletContext();

	    // Database
	    String dbHost = System.getenv("DB_HOST");
	    String dbPort = System.getenv("DB_PORT");
	    String dbName = System.getenv("DB_NAME");
	    String dbUser = System.getenv("DB_USER");
	    String dbPassword = System.getenv("DB_PASSWORD");

	    if (dbHost == null || dbPort == null || dbName == null
	            || dbUser == null || dbPassword == null) {

	        throw new RuntimeException("Missing DB environment variables");
	    }

	    String jdbcUrl = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?sslMode=REQUIRED";

	    context.setAttribute("db.url", jdbcUrl);
	    context.setAttribute("db.user", dbUser);
	    context.setAttribute("db.password", dbPassword);

	    // JWT + Password Config
	    String jwtSecret = System.getenv("JWT_SECRET");
	    String jwtExpiry = System.getenv("JWT_EXPIRY_HOURS");
	    String passwdCost = System.getenv("PASSWD_COST");

	    if (jwtSecret == null) {
	        throw new RuntimeException("JWT_SECRET not configured");
	    }

	    context.setAttribute("jwt.secret", jwtSecret);
	    context.setAttribute("jwt.expiryHours",
	            jwtExpiry != null ? Integer.parseInt(jwtExpiry) : 24);

	    context.setAttribute("passwd.costFactor",
	            passwdCost != null ? Integer.parseInt(passwdCost) : 10);
	}

}
