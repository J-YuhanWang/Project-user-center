package com.levda.usercenter.common;
/**
 * @author BlairWang
 * @Date 11/01/2026 7:43 pm
 * @Version 1.0
 */
public enum ErrorCode {
    SUCCESS(0, "ok", ""),
    // === Client Error (4xxxx) ===
    // 1. General Parameter Error (Includes: null object, null attribute, parameter
    // too long, illegal characters, etc.)
    PARAMS_ERROR(40000, "Incorrect request parameters", ""),
    // 2. Not Logged In (Frontend reception of this code typically redirects to
    // login page)
    NOT_LOGIN(40100, "Not login", ""),
    // 3. No Permissions (Frontend reception of this code typically shows "You do
    // not have permission")
    NO_AUTH(40101, "No authentication", ""),

    // === Server Error (5xxxx) ===
    // 1. General System Error (Includes: database connection failure, code
    // exceptions, timeout, etc.)
    SYSTEM_ERROR(50000, "Internal system error", "");

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
