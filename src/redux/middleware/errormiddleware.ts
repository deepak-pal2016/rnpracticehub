/* eslint-disable @typescript-eslint/no-unused-vars */
import { isRejectedWithValue,Middleware } from "@reduxjs/toolkit";
import { showError } from "@components/Flashmessge";

export const errorMiddleware:Middleware = ()=> next => action =>{
    if(isRejectedWithValue(action)){
        console.log(action.payload, 'API ERROR');
        //@ts-ignore
        showError(action.payload)
    }

    return next(action)
}