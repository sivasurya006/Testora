FROM tomcat:9.0-jdk17

# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy WAR
COPY testora.war /usr/local/tomcat/webapps/ROOT.war

# Replace Tomcat port with Render PORT
CMD sed -i "s/port=\"8080\"/port=\"${PORT}\"/" /usr/local/tomcat/conf/server.xml && catalina.sh run