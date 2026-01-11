package com.levda.usercenter.common;/*
 * @author BlairWang
 * @Date 11/01/2026 6:59 pm
 * @Version 1.0
 */

public class ResultUtils {
    public static <T> BaseResponse<T> success(T data){
        return new BaseResponse<>(0,data,"ok");
    }
}
