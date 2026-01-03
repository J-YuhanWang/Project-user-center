package com.levda.usercenter.model.request;
/**
 * User Registration Request DTO
 *
 * This class serves as a data transfer object to capture
 * the payload from the client-side registration form.
 *
 * @author BlairWang
 * @Date 03/01/2026 4:08 pm
 * @Version 1.0
 */

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class UserRegisterRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String userAccount;

    private String userPassword;

    private String checkPassword;
}
