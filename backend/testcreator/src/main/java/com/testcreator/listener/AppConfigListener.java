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

	public void contextInitialized(ServletContextEvent sce) {
		ServletContext context = sce.getServletContext();
		Properties props = new Properties();
		InputStream input = Thread.currentThread().getContextClassLoader().getResourceAsStream("config/app.properties");
		
		try {
			props.load(input);
		} catch (IOException e) {
			e.printStackTrace();
		}
		props.forEach((key, value) -> {
			context.setInitParameter(key.toString(), value.toString());
		});
	}

}
