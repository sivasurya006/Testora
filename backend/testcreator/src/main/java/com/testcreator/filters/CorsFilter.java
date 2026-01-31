package com.testcreator.filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class CorsFilter extends HttpFilter implements Filter {
       
    public CorsFilter() {
        super();
    }
	public void destroy() {
		
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
	        throws IOException, ServletException {

	    HttpServletRequest request = (HttpServletRequest) req;
	    HttpServletResponse response = (HttpServletResponse) res;

	    String origin = request.getHeader("Origin");
	    if ( "http://localhost:8081".equals(origin) ||  "http://testcreator.com:8081".equals(origin) || "http://192.168.20.6:8081".equals(origin) || "https://biochemically-fattish-kynlee.ngrok-free.dev".equals(origin)) {
	        response.setHeader("Access-Control-Allow-Origin", origin);
	        response.setHeader("Access-Control-Allow-Credentials", "true");
	    }

	    response.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
	    response.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization, X-Client-Type, X-ClassroomId");

	    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
	        response.setStatus(HttpServletResponse.SC_OK);
	        return; 
	    }

	    chain.doFilter(req, res);
	}


	public void init(FilterConfig fConfig) throws ServletException {
		System.out.println("inited");
	}

}
