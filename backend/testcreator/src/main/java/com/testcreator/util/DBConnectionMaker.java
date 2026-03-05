package com.testcreator.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletContext;

public class DBConnectionMaker {

	private static final Logger logger = LogManager.getLogger(DBConnectionMaker.class);
	private static HikariDataSource dataSource;
	private static final ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();

	private static synchronized void initPool(String url, String user, String password) throws ClassNotFoundException {
		if (dataSource == null) {
			logger.info("Initializing HikariCP DataSource...");
			Class.forName("com.mysql.cj.jdbc.Driver");

			HikariConfig config = new HikariConfig();
			config.setJdbcUrl(url);
			config.setUsername(user);
			config.setPassword(password);

			config.setMaximumPoolSize(20);
			config.setMinimumIdle(5);
			config.setIdleTimeout(30000);
			config.setMaxLifetime(1800000);
			config.setConnectionTimeout(30000);
			config.setPoolName("TestoraHikariPool");

			dataSource = new HikariDataSource(config);
			logger.info("HikariCP DataSource initialized successfully");
		}
	}

	private DBConnectionMaker(ServletContext context) throws SQLException, ClassNotFoundException {
		if (dataSource == null) {
			String url = (String) context.getAttribute("db.url");
			String user = (String) context.getAttribute("db.user");
			String password = (String) context.getAttribute("db.password");
			initPool(url, user, password);
		}
	}

	private DBConnectionMaker() throws SQLException {
		if (dataSource == null) {
			String dbHost = System.getenv("DB_HOST");
			String dbPort = System.getenv("DB_PORT");
			String dbName = System.getenv("DB_NAME");
			String dbUser = System.getenv("DB_USER");
			String dbPassword = System.getenv("DB_PASSWORD");

			if (dbHost == null || dbPort == null || dbName == null || dbUser == null || dbPassword == null) {
				logger.error("Missing DB environment variables");
				throw new RuntimeException("Missing DB environment variables");
			}

			String jdbcUrl = "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + dbName + "?sslMode=REQUIRED";
			logger.info("Connection url : {}", jdbcUrl);
			try {
				initPool(jdbcUrl, dbUser, dbPassword);
			} catch (ClassNotFoundException e) {
				logger.error("MySQL driver not found", e);
				throw new SQLException("MySQL driver not found", e);
			}
		}
	}

	public static DBConnectionMaker getInstance(ServletContext context) throws ClassNotFoundException, SQLException {
		return new DBConnectionMaker(context);
	}

	public static DBConnectionMaker getInstance() throws SQLException {
		return new DBConnectionMaker();
	}

	public Connection getConnection() {
		try {
			Connection conn = connectionHolder.get();
			if (conn == null || conn.isClosed()) {
				conn = dataSource.getConnection();
				connectionHolder.set(conn);
				logger.debug(
						"Database Connection acquired and bound to thread. Active connections: {}, Total connections: {}",
						dataSource.getHikariPoolMXBean().getActiveConnections(),
						dataSource.getHikariPoolMXBean().getTotalConnections());
			}
			return conn;
		} catch (SQLException e) {
			logger.error("Failed to get connection from Hikari pool", e);
			throw new RuntimeException("Failed to get connection from Hikari pool", e);
		}
	}

	public static void closeCurrentThreadConnection() {
		Connection conn = connectionHolder.get();
		if (conn != null) {
			try {
				if (!conn.isClosed()) {
					conn.close();
					logger.debug("Database Connection closed and returned to pool.");
					logger.debug(
							"Database Connection closed and returned to pool Active connections: {}, Total connections: {}",
							dataSource.getHikariPoolMXBean().getActiveConnections(),
							dataSource.getHikariPoolMXBean().getTotalConnections());
				}
			} catch (SQLException e) {
				logger.error("Error closing connection", e);
			} finally {
				connectionHolder.remove();
			}
		}
	}
}
