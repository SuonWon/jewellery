import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { brightnessApi } from "../apis/brightnessApi";
import { gradeApi } from "../apis/gradeApi";
import { typeApi } from "../apis/typeApi";
import { stoneApi } from "../apis/stoneApi";
import { uomApi } from "../apis/uomApi";
import { customerApi } from "../apis/customerApi";

export const store = configureStore({
    reducer: {
        [brightnessApi.reducerPath] : brightnessApi.reducer,
        [gradeApi.reducerPath] : gradeApi.reducer,
        [typeApi.reducerPath] : typeApi.reducer,
        [stoneApi.reducerPath] : stoneApi.reducer,
        [uomApi.reducerPath] : uomApi.reducer,
        [customerApi.reducerPath] : customerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(brightnessApi.middleware)
            .concat(gradeApi.middleware)
            .concat(typeApi.middleware)
            .concat(stoneApi.middleware)
            .concat(uomApi.middleware)
            .concat(customerApi.middleware);
    }
});

export { useAddBrightnessMutation, useFetchBrightnessByIdQuery, useFetchBrightnessQuery, useUpdateBrightnessMutation, useRemoveBrightnessMutation } from "../apis/brightnessApi";
export { useFetchGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation } from "../apis/gradeApi";
export { useFetchTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation } from "../apis/typeApi";
export { useFetchStoneQuery, useFetchStoneByIdQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation } from "../apis/stoneApi";
export { useFetchUOMQuery, useFetchUOMByIdQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } from "../apis/uomApi";
export { useFetchCustomerQuery, useFetchCustomerByIdQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } from "../apis/customerApi";