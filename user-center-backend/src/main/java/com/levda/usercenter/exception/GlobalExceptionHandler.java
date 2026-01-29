package com.levda.usercenter.exception;

import com.levda.usercenter.common.BaseResponse;
import com.levda.usercenter.common.ErrorCode;
import com.levda.usercenter.common.ResultUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
/**
 * Global exception handler
 * * Intercepts exceptions thrown by Controllers and converts them into standardized JSON responses.
 *
 * @author BlairWang
 * @Date 29/01/2026 11:23 pm
 * @Version 2.0
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle custom Business Exceptions (Expected errors)
     * e.g., Login failed, Params error
     */
    @ExceptionHandler(BusinessException.class)
    public BaseResponse<?> businessExceptionHandler(BusinessException e) {
        log.error("BusinessException: " + e.getMessage(), e);
        return ResultUtils.error(e.getCode(), e.getMessage(), "");
    }

    /**
     * Handle Global Runtime Exceptions (Unexpected errors)
     * e.g., NullPointerException, Database connection failed
     */
    @ExceptionHandler
    public BaseResponse<?> runtimeExceptionHandler(RuntimeException e) {
        log.error("RuntimeException:", e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR, e.getMessage(), "");
    }
}
