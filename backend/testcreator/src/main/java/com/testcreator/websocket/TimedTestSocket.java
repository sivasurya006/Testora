package com.testcreator.websocket;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.struts2.ServletActionContext;

import com.testcreator.dao.TestDao;
import com.testcreator.service.TestService;
import com.testcreator.util.DBConnectionMaker;
import com.testcreator.websocket.service.TimedTestService;

@ServerEndpoint("/ws/timedtest")
public class TimedTestSocket {

	private static Set<Session> sessions = new CopyOnWriteArraySet<>();
	private static Map<String, ScheduledFuture<?>> userTimers = new ConcurrentHashMap<>();
	private static ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10);

	@OnOpen
	public void onOpen(Session session) throws IOException, SQLException {
		sessions.add(session);
		System.out.println("New user connected on Test attempId "+session.getRequestParameterMap().get("attemptId"));
		int testId = Integer.parseInt(session.getRequestParameterMap().get("testId").get(0));
		
		 Connection connection = DBConnectionMaker.getInstance().getConnection();
		 int durationMinutes = new TestDao(connection).getTestDuration(testId);
		 
		 System.out.println(durationMinutes+" durationMinutes");
		
		Runnable timeoutTask = () -> {
			try {
				if (session.isOpen()) {
					session.getAsyncRemote().sendText("{\"type\":\"FINISH_TEST\"}");
					session.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		};
		
		ScheduledFuture<?> future = scheduler.schedule(timeoutTask, durationMinutes, TimeUnit.MINUTES);
		userTimers.put(session.getId(), future);
	}

	@OnMessage
	public void onMessage(Session session, String message) throws IOException {
		System.out.println(message);
	}

	@OnClose
	public void onClose(Session session) throws IOException {
		sessions.remove(session);

	    ScheduledFuture<?> future = userTimers.remove(session.getId());

	    if (future != null) {
	        future.cancel(true);
	    }

	    System.out.println("User disconnected");

	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		// Do error handling here
	}
}