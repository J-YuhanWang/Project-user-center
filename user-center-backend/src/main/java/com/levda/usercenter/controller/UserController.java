package com.levda.usercenter.controller;
/*
 * User interface
 * @author BlairWang
 * @Date 02/01/2026 10:24 pm
 * @Version 1.0
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.levda.usercenter.common.BaseResponse;
import com.levda.usercenter.common.ErrorCode;
import com.levda.usercenter.common.ResultUtils;
import com.levda.usercenter.exception.BusinessException;
import com.levda.usercenter.model.User;
import com.levda.usercenter.model.request.UserLoginRequest;
import com.levda.usercenter.model.request.UserRegisterRequest;
import com.levda.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.levda.usercenter.constant.UserConstant.USER_LOGIN_STATE;

@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            // BusinessException wraps exceptions, eventually handled by
            // GlobalExceptionHandler
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Request parameters cannot be null");
        }

        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        // Check if those three attributes exist--prune
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR,
                    "Request parameters missing (Account, Password, Check Password)");
        }

        long result = userService.userRegister(userAccount, userPassword, checkPassword);
        // Success wrapped with ResultUtils.success
        return ResultUtils.success(result);
    }

    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Request parameters cannot be null");
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account or password cannot be empty");
        }
        User result = userService.userLogin(userAccount, userPassword, request);
        return ResultUtils.success(result);
    }

    @PostMapping("/logout")
    public BaseResponse<Integer> userLogout(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Request parameters cannot be null");
        }
        int result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request) {
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser = (User) userObj;
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN, "User not logged in or session expired");
        }
        // Find current user id
        long userId = currentUser.getId();
        // Get user by id
        User user = userService.getById(userId);

        // Check if user is null to prevent session persisting ID but DB record deleted
        if (user == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN, "Account does not exist");
        }
        // User de-identification (desensitization)
        User safetyUser = userService.getSafetyUser(user);
        return ResultUtils.success(safetyUser);
    }

    @GetMapping("/search")
    public BaseResponse<List<User>> searchUser(String username, HttpServletRequest request) {
        // Authentication: Only the administrator could query
        if (!isAdmin(request)) {
            // return new ArrayList<>();
            throw new BusinessException(ErrorCode.NO_AUTH, "Account has no administrator privileges");
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(username)) {
            queryWrapper.like("username", username);
        }
        List<User> userList = userService.list(queryWrapper);
        List<User> list = userList.stream().map(user -> userService.getSafetyUser(user)).collect(Collectors.toList());
        return ResultUtils.success(list);
    }


    // object format
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteUser(@RequestBody long id, HttpServletRequest request) {
        // Authentication: Only the administrator could query
        if (!isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH, "Account has no administrator privileges");
        }
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "ID must be a positive integer");
        }
        boolean isDelete = userService.removeById(id);
        return ResultUtils.success(isDelete);
    }

    /**
     * Whether the user is an administrator.
     * 
     * @param request
     * @return
     */
    public boolean isAdmin(HttpServletRequest request) {

        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        if (user == null || user.getUserRole() != 1) {
            return false;
        }
        return true;
    }

}
