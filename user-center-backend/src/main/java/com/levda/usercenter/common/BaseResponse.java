package com.levda.usercenter.common;/*
 * @author BlairWang
 * @Date 11/01/2026 6:01 pm
 * @Version 1.0
 */

import lombok.Data;

import java.io.Serializable;

/**
 * General response class
 * @param <T> data type
 */
@Data
public class BaseResponse<T> implements Serializable {
    private int code;

    private T data;

    private String message;

    public BaseResponse(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public BaseResponse(int code, T data) {
        this(code,data,"");
    }

}
