package com.levda.usercenter.model.request;/*
 * @author BlairWang
 * @Date 03/01/2026 5:36 pm
 * @Version 1.0
 */

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * User login request DTO
 */

@Data
public class UserLoginRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String userAccount;

    private String userPassword;

}
