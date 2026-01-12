package com.levda.usercenter.common;/*
 * @author BlairWang
 * @Date 11/01/2026 7:43 pm
 * @Version 1.0
 */

public enum ErrorCode {
    SUCCESS(0,"ok",""),
    // === 客户端错误 (4xxxx) ===
    // 1. 万能参数错误 (包含了：对象为空、属性为空、参数过长、非法字符等)
    PARAMS_ERROR(40000,"Incorrect request parameters",""),
    // 2. 没登录 (前端收到这个码，通常会跳转到登录页)
    NOT_LOGIN(40100,"Not login",""),
    // 3. 没权限 (前端收到这个码，通常会显示“您无权访问”)
    NO_AUTH(40101,"No authentication",""),

    // === 服务端错误 (5xxxx) ===
    // 1. 万能系统错误 (包含了：数据库连不上、代码抛异常、超时等)
    SYSTEM_ERROR(50000,"Internal system error","");

    private final int code;

    /**
     * Error Code message
     */
    private final String message;

    /**
     * Error Code description
     */
    private final String description;

    ErrorCode(int code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }
}
