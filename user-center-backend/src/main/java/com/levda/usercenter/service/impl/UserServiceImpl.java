package com.levda.usercenter.service.impl;
import java.util.Date;
/**
 * user service implement class
 * @author BlairWang
 * @Date 30/12/2025 9:07 pm
 * @Version 1.0
 */

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.levda.usercenter.mapper.UserMapper;
import com.levda.usercenter.model.User;
import com.levda.usercenter.service.UserService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service

public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {
    @Resource
    private UserMapper userMapper;

    /**
     * Adding salt: obfuscating the password
     */
    private static final String SALT = "blair_user_center!@#";

    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword) {
        //No.1 Register
        //1. User verification
//        if(userAccount == null || userPassword==null || checkPassword == null || userAccount.length()>0){}
        if(StringUtils.isAnyBlank(userAccount,userPassword,checkPassword)){
            //TODO: Change to a custom exception
            return -1;
        }
        //2. userAccount length must be at least 4 characters.
        if(userAccount.length() < 4){
            return -1;
        }
        //3.user password length must be at least 8 characters.
        if(userPassword.length() < 8 || checkPassword.length()<8){
            return -1;
        }


        //5.账户不能包含特殊字符
        // 5.1. 定义正则表达式（建议定义为常量）
        String validPattern = "^[a-zA-Z0-9_]+$";
        // 5.2. 使用 Pattern 和 Matcher 进行匹配
        Matcher matcher = Pattern.compile(validPattern).matcher(userAccount);
        // 5.3. 如果不匹配（包含特殊字符），直接返回错误码或抛出异常
        if(!matcher.find()){
            return -1;
        }

        //6.密码和校验密码相同
        if(!userPassword.equals(checkPassword)){
            return -1;
        }

        //优化步骤1：将用户重复逻辑放到校验特殊字符之后，因为如果本身包含特殊字符，就直接报错提示，不必去数据库校验
        // 4.用户名不能重复username could not be duplicated
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        //第一个参数 "userAccount" 必须对应数据库里的表字段名
        queryWrapper.eq("userAccount",userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if(count > 0){
            return -1;
        }

        //No.2 加密功能 Password Salting & Hashing: md5不需要解密，是单向加密的非对称加密方式
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT+userPassword).getBytes());

        //No.3 插入新数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        boolean saveResult = this.save(user);
        if(!saveResult){
            return -1;
        }

        return user.getId();
    }

}
