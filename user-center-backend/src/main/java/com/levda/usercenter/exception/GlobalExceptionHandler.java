package com.levda.usercenter.exception;/*
 * @author BlairWang
 * @Date 11/01/2026 11:23 pm
 * @Version 1.0
 */

import com.levda.usercenter.common.BaseResponse;
import com.levda.usercenter.common.ErrorCode;
import com.levda.usercenter.common.ResultUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    //意思是只捕获BusinessException的异常，针对什么异常 做什么处理
    @ExceptionHandler(BusinessException.class)
    public BaseResponse businessExceptionHandler(BusinessException e){
        log.error("BusinessException: "+e.getMessage(), e);
        return ResultUtils.error(e.getCode(),e.getMessage(),"");
    }

    public BaseResponse runtimeExceptionHandler(RuntimeException e){
        log.error("RuntimeException:",e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR,e.getMessage(),"");
    }
}
