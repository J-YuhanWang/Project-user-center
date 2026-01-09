package com.levda.usercenter.controller;
/*
 * User interface
 * @author BlairWang
 * @Date 02/01/2026 10:24 pm
 * @Version 1.0
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
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
    public Long userRegister(@RequestBody UserRegisterRequest userRegisterRequest){
        if(userRegisterRequest == null){
            return null;
        }

        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        //Check if those three attributes exist--prune
        if(StringUtils.isAnyBlank(userAccount,userPassword,checkPassword)){
            return null;
        }

        return userService.userRegister(userAccount,userPassword,checkPassword);
    }

    @PostMapping("/login")
    public User userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request){
        if(userLoginRequest == null){
            return null;
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if(StringUtils.isAnyBlank(userAccount,userPassword)){
            return null;
        }
        return userService.userLogin(userAccount,userPassword,request);
    }

    @GetMapping("/current")
    public User getCurrentUser(HttpServletRequest request){
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser =(User) userObj;
        if(currentUser==null){
            return null;
        }
        //找到当前的currentUser的id
        long userId = currentUser.getId();
        //通过id获取user
        User user = userService.getById(userId);
        //TODO:判断用户是否合法：是否被封号、删除等，做出相应处理
        //用户脱敏
        return userService.getSafetyUser(user);
    }

    @GetMapping("/search")
    public List<User> searchUser(String username,HttpServletRequest request){
        // Authentication: Only the administrator could query
        if(!isAdmin(request)){
            return new ArrayList<>();
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotBlank(username)){
            queryWrapper.like("username",username);
        }
        List<User> userList = userService.list(queryWrapper);
//        return userList.stream().map(user->{
//            user.setUserPassword(null);
//            return userService.getSafetyUser(user);
//        }).collect(Collectors.toList());
        return userList.stream().map(user->userService.getSafetyUser(user)).collect(Collectors.toList());
    }

    @PostMapping("/delete")
    public boolean deleteUser(@RequestBody long id,HttpServletRequest request){
        // Authentication: Only the administrator could query
        if(!isAdmin(request)){
            return false;
        }

        if(id <= 0){
            return false;
        }
        return userService.removeById(id);
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
