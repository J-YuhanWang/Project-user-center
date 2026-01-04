package com.levda.usercenter;/*
 * @author BlairWang
 * @Date 30/12/2025 3:25 pm
 * @Version 1.0
 */

import com.levda.usercenter.mapper.UserMapper;
import com.levda.usercenter.model.User;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.List;

@SpringBootTest
public class SampleTest {

//    @Autowired 按照类型注入
//    @Resource 按照Java bean的名称去注入
    @Resource
    private UserMapper userMapper;

    /**
     * Testing database connectivity
     */
    @Test
    public void testSelect(){
        System.out.println("----selectAll method test");
//        queryWrapper是查询条件，为null代表查询所有
        List<User> userList = userMapper.selectList(null);
        Assertions.assertEquals(2, userList.size());
        userList.forEach(System.out::println);

    }
}
