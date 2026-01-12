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
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest){
        if(userRegisterRequest == null){
            //异常的用BusinessException异常 封装，最后都会被GlobalExceptionHandler接住进入相应处理流程
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"请求参数不能为空");
        }

        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        //Check if those three attributes exist--prune
        if(StringUtils.isAnyBlank(userAccount,userPassword,checkPassword)){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"请求参数缺失(账号、密码、确认密码)");
        }

        long result = userService.userRegister(userAccount,userPassword,checkPassword);
        //成功的用ResultUtils.success封装
        return ResultUtils.success(result);
    }

    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request){
        if(userLoginRequest == null){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"请求参数不能为空");
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if(StringUtils.isAnyBlank(userAccount,userPassword)){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"账号或密码不能为空");
        }
        User result = userService.userLogin(userAccount,userPassword,request);
        return ResultUtils.success(result);
    }
    @PostMapping("/logout")
    public BaseResponse<Integer> userLogout(HttpServletRequest request){
        if(request == null){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"请求参数不能为空");
        }
        int result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request){
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser =(User) userObj;
        if(currentUser==null){
            throw new BusinessException(ErrorCode.NOT_LOGIN,"用户未登录或登录已过期");
        }
        //找到当前的currentUser的id
        long userId = currentUser.getId();
        //通过id获取user
        User user = userService.getById(userId);

        //此时判空防止session记录了ID，但是数据库中账户信息已被删除
        if(user == null){
            throw new BusinessException(ErrorCode.NOT_LOGIN,"该账户不存在");
        }
        //用户脱敏
        User safetyUser = userService.getSafetyUser(user);
        return ResultUtils.success(safetyUser);
    }

    @GetMapping("/search")
    public BaseResponse<List<User>> searchUser(String username,HttpServletRequest request){
        // Authentication: Only the administrator could query
        if(!isAdmin(request)){
//            return new ArrayList<>();
            throw new BusinessException(ErrorCode.NO_AUTH,"该账户没有管理员权限");
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotBlank(username)){
            queryWrapper.like("username",username);
        }
        List<User> userList = userService.list(queryWrapper);
        List<User> list = userList.stream().map(user->userService.getSafetyUser(user)).collect(Collectors.toList());
        return ResultUtils.success(list);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteUser(@RequestBody long id,HttpServletRequest request){
        // Authentication: Only the administrator could query
        if(!isAdmin(request)){
            throw new BusinessException(ErrorCode.NO_AUTH,"该账户没有管理员权限");
        }
        if(id <= 0){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"ID必须为正整数");
        }
        boolean isDelete = userService.removeById(id);
        return ResultUtils.success(isDelete);
    }

    /**
     * Whether the user is an administrator.
     * @param request
     * @return
     */
    public boolean isAdmin(HttpServletRequest request){

        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User)userObj;
        if(user == null || user.getUserRole()!=1){
            return false;
        }
        return true;
    }


}
