package com.levda.usercenter.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@TableName(value="user")
public class User implements Serializable {

    private Long id;
    private String username; // 昵称
    private String userAccount; //账户号
    private String avatarUrl;
    private Integer gender;
    private String userPassword;
    private String phone;
    private String email;
    private Integer userStatus;
    private Integer userRole;//0-regular user, 1-administrator

    private Date createTime;
    private Date updateTime;
    @TableLogic
    private Integer isDelete;
    @Serial
    private static final long serialVersionUID = 1L;

}