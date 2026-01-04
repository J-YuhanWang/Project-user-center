package com.levda.usercenter.constant;/*
 * @author BlairWang
 * @Date 04/01/2026 12:35 pm
 * @Version 1.0
 */

/**
 * User constant class
 *
 * Interface for attribute can have public, static as default
 */
public interface UserConstant {

    /**
     * User login state key
     */
    String USER_LOGIN_STATE = "userLoginState";

    //------Authentication-----
    /**
     * Default authentication
     */
    int DEFAULT_ROLE = 0;

    /**
     * Administrator authentication
     */
    int ADMIN_ROLE = 1;

}
