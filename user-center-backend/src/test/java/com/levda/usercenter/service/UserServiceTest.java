package com.levda.usercenter.service;
import java.util.Date;

import com.levda.usercenter.model.User;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/* User service test
 * @author BlairWang
 * @Date 30/12/2025 9:19 pm
 * @Version 1.0
 */

@SpringBootTest
public class UserServiceTest {

    //    @Autowired 按照类型注入
    //    @Resource 按照Java bean的名称去注入
    @Resource
    private UserService userService;

    @Test
    public void testAddUser(){
//        when clicked the object, alt + enter-> choose generate all setter
        User user = new User();
        user.setUsername("testGigglen");
        user.setUserAccount("test123");
        user.setAvatarUrl("https://account.bilibili.com/account/face/upload/?spm_id_from=333.1387.0.0");
        user.setGender(0);
        user.setUserPassword("xxx");
        user.setPhone("12345");
        user.setEmail("123");

        boolean res = userService.save(user);
        System.out.println(user.getId());
        Assertions.assertTrue(res);
    }

}