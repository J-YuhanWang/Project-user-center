package com.levda.usercenter.common;

/**
 * Utility class for generating response objects.
 * Implements the Simple Factory Pattern to decouple response creation.
 *
 * @author BlairWang
 * @since 11/01/2026
 * @version 1.0
 */

public class ResultUtils {
    /**
     * Success response with data
     *
     * @param data response data
     * @param <T>  type of data
     * @return BaseResponse with success code (0)
     */
    public static <T> BaseResponse<T> success(T data){
        return new BaseResponse<>(0,data,"ok");
    }

    /**
     * Failure response based on ErrorCode enum
     *
     * @param errorCode specific error enum
     * @return BaseResponse with error info
     */
    public static <T> BaseResponse<T> error(ErrorCode errorCode){
        return new BaseResponse<>(errorCode);
    }

    /**
     * Failure response with custom code and message
     *
     * @param code        custom error code
     * @param message     error message
     * @param description detailed error description
     * @return BaseResponse
     */
    public static <T> BaseResponse<T> error(int code,String message,String description){
        return new BaseResponse<>(code,null,message,description);
    }

    /**
     * Failure response with ErrorCode but custom message/description
     *
     * @param errorCode   specific error enum
     * @param message     custom message
     * @param description detailed description
     * @return BaseResponse
     */
    public static <T> BaseResponse<T> error(ErrorCode errorCode,String message,String description){
        return new BaseResponse<>(errorCode.getCode(),null,message,description);
    }

    /**
     * Failure response with ErrorCode and custom description
     * (Uses the default message from ErrorCode)
     *
     * @param errorCode   specific error enum
     * @param description detailed description
     * @return BaseResponse
     */
    public static <T> BaseResponse<T> error(ErrorCode errorCode,String description){
        return new BaseResponse<>(errorCode.getCode(),null,errorCode.getMessage(),description);
    }


}
