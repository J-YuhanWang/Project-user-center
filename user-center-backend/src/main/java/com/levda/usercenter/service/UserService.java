package com.levda.usercenter.service;/*
 * @author BlairWang
 * @Date 30/12/2025 9:06 pm
 * @Version 1.0
 */

import com.baomidou.mybatisplus.extension.service.IService;
import com.levda.usercenter.model.User;
import jakarta.servlet.http.HttpServletRequest;

public interface UserService extends IService<User> {

    /**
     * User Register function
     * @param userAccount user account
     * @param userPassword user password
     * @param checkPassword user password double check
     * @return new user id
     */
    long userRegister(String userAccount, String userPassword, String checkPassword);

    /**
     * User Login function
     *
     * @param userAccount  user account
     * @param userPassword user password
     * @param request
     * @return De-identified user information脱敏后的用户信息
     */
    User userLogin(String userAccount, String userPassword, HttpServletRequest request);
}
