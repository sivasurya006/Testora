package com.testcreator.filters;

import com.testcreator.util.DBConnectionMaker;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

public class DBConnectionFilter implements Filter {

    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            chain.doFilter(request, response);
        } finally {
            DBConnectionMaker.closeCurrentThreadConnection();
        }
    }

    public void init(FilterConfig fConfig) throws ServletException {
    }
}
