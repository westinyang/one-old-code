package com.yzw.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * 数据库工具类
 */
public class BaseDao {
	//数据库驱动字符串
	private static String driverStr = "oracle.jdbc.driver.OracleDriver";
	//连接URL字符串
	private static String url = "jdbc:oracle:thin:@localhost:1521:ORCL";
	//数据库用户名
	private static String user = "scott";
	//密码
	private static String pwd = "scott";
	
	/**
	 * 获取数据库连接对象
	 * @return 连接对象
	 */
	public static Connection getConnection() {
		Connection conn = null;
		//获取连接并捕获异常
		try {
			Class.forName(driverStr);
			conn = DriverManager.getConnection(url, user, pwd);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;	//返回连接对象
	}
	
	/**
	 * 关闭数据库连接
	 * @param conn 数据库连接
	 * @param stmt 对象
	 * @param rs 结果集
	 */
	public static void closeAll(Connection conn, Statement stmt, ResultSet rs) {
		//关闭资源
			if (rs != null) {
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			}
			if (stmt != null) {
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			}
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}				
			}
	}
}