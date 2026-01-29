package com.levda.usercenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.levda.usercenter.common.ErrorCode;
import com.levda.usercenter.exception.BusinessException;
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

import static com.levda.usercenter.constant.UserConstant.USER_LOGIN_STATE;

/**
 * user service implement class
 *
 * @author BlairWang
 * @Date 30/12/2025 9:07 pm
 * @Version 1.0
 */

@Service
@Slf4j // Lombok annotation for logging
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    @Resource
    private UserMapper userMapper;

    /**
     * Adding salt: obfuscating the password
     */
    private static final String SALT = "blair_user_center!@#";

    /**
     * Account pattern
     */
    private static final Pattern VALID_ACCOUNT_PATTERN = Pattern.compile("^[a-zA-Z0-9_]+$");

    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword) {
        //No.1 Register
        //1. User verification
        //if(userAccount == null || userPassword==null || checkPassword == null || userAccount.length()>0){}
        if(StringUtils.isAnyBlank(userAccount,userPassword,checkPassword)){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Parameters cannot be empty");
        }
        //2. userAccount length must be at least 4 characters.
        if(userAccount.length() < 4){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "User account must be at least 4 characters");
        }
        //3.user password length must be at least 8 characters.
        if(userPassword.length() < 8 || checkPassword.length()<8){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "User password must be at least 8 characters");
        }

        // 5. Account cannot contain special characters
        // 5.2. Match using Pattern and Matcher
        Matcher matcher = VALID_ACCOUNT_PATTERN.matcher(userAccount);
        // 5.3. If not matched (contains special characters), return error code
        if(!matcher.find()){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account contains invalid characters");
        }

        //6. Password and check password must match
        if(!userPassword.equals(checkPassword)){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Passwords do not match");
        }

        // Optimization Step 1: Move duplicate user verification after special character
        // check
        // 4. Username cannot be duplicated
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        // First parameter "userAccount" must match the database column name
        queryWrapper.eq("userAccount",userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if(count > 0){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account already exists");
        }

        // No.2 Encryption: Password Salting & Hashing: md5 is one-way encryption
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());

        // No.3 Insert new data
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        boolean saveResult = this.save(user);
        if (!saveResult) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "Registration failed, database error");
        }

        return user.getId();
    }

    @Override
    public User userLogin(String userAccount, String userPassword, HttpServletRequest request) {
        // No.1 Register
        // 1. User verification
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Parameters cannot be empty");
        }
        // 2. userAccount length must be at least 4 characters.
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "User account must be at least 4 characters");
        }
        // 3.user password length must be at least 8 characters.
        if (userPassword.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "User password must be at least 8 characters");
        }

        // 5. Account cannot contain special characters
        // 5.2. Match using Pattern and Matcher
        Matcher matcher = VALID_ACCOUNT_PATTERN.matcher(userAccount);
        // 5.3. If not matched (contains special characters), return error code
        if(!matcher.find()){
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account contains invalid characters");
        }

        //No.2 Encryption: Password Salting & Hashing
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT+userPassword).getBytes());
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount",userAccount);
        queryWrapper.eq("userPassword",encryptPassword);
        User user = userMapper.selectOne(queryWrapper);
        if(user == null){
            // User does not exist or password incorrect
            log.info("User login failed, userAccount cannot match userPassword");
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "User mismatch or password incorrect");
        }

        //No.3 User desensitization
        User safetyUser= getSafetyUser(user);

        //No.4 Record user login status
        request.getSession().setAttribute(USER_LOGIN_STATE,safetyUser);

        return safetyUser;
    }

    /**
     * User desensitization
     *
     * @param originUser origin user
     * @return safety user
     */
    @Override
    public User getSafetyUser(User originUser) {
        // Check null
        if (originUser == null) {
            return null;
        }
        User safetyUser = new User();
        safetyUser.setId(originUser.getId());
        safetyUser.setUsername(originUser.getUsername());
        safetyUser.setUserAccount(originUser.getUserAccount());
        safetyUser.setAvatarUrl(originUser.getAvatarUrl());
        safetyUser.setGender(originUser.getGender());
        safetyUser.setUserRole(originUser.getUserRole());
        safetyUser.setPhone(originUser.getPhone());
        safetyUser.setEmail(originUser.getEmail());
        safetyUser.setUserStatus(originUser.getUserStatus());
        safetyUser.setCreateTime(originUser.getCreateTime());
        return safetyUser;
    }

    /**
     * User logout
     *
     * @param request
     */
    @Override
    public int userLogout(HttpServletRequest request) {
        // Remove user login status
        request.getSession().removeAttribute(USER_LOGIN_STATE);
        return 1;
    }

}
