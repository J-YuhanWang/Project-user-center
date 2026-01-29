package com.levda.usercenter.exception;/*
                                       * @author BlairWang
                                       * @Date 11/01/2026 10:54 pm
                                       * @Version 1.0
                                       */

import com.levda.usercenter.common.ErrorCode;


public class BusinessException extends RuntimeException {
    // Add code and description attributes to RuntimeException
    private int code;

    private String description;

    public BusinessException(String message, int code, String description) {
        super(message);
        this.code = code;
        this.description = description;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.description = errorCode.getDescription();
    }

    public BusinessException(ErrorCode errorCode, String description) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
