import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { brightnessApi } from "../apis/brightnessApi";
import { gradeApi } from "../apis/gradeApi";
import { typeApi } from "../apis/typeApi";
import { stoneApi } from "../apis/stoneApi";
import { uomApi } from "../apis/uomApi";
import { customerApi } from "../apis/customerApi";
import { supplierApi } from "../apis/supplierApi";
import { stoneDetailsApi } from "../apis/stoneDetailsApi";
import { purchaseApi } from "../apis/purchaseApi";

export const store = configureStore({
    reducer: {
        [brightnessApi.reducerPath] : brightnessApi.reducer,
        [gradeApi.reducerPath] : gradeApi.reducer,
        [typeApi.reducerPath] : typeApi.reducer,
        [stoneApi.reducerPath] : stoneApi.reducer,
        [uomApi.reducerPath] : uomApi.reducer,
        [customerApi.reducerPath] : customerApi.reducer,
        [supplierApi.reducerPath] : supplierApi.reducer,
        [stoneDetailsApi.reducerPath] : stoneDetailsApi.reducer,
        [purchaseApi.reducerPath] : purchaseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(brightnessApi.middleware)
            .concat(gradeApi.middleware)
            .concat(typeApi.middleware)
            .concat(stoneApi.middleware)
            .concat(uomApi.middleware)
            .concat(customerApi.middleware)
            .concat(supplierApi.middleware)
            .concat(stoneDetailsApi.middleware)
            .concat(purchaseApi.middleware);
    }
});

export { useAddBrightnessMutation, useFetchTrueBrightnessQuery, useFetchBrightnessByIdQuery, useFetchBrightnessQuery, useUpdateBrightnessMutation, useRemoveBrightnessMutation } from "../apis/brightnessApi";
export { useFetchGradeQuery, useFetchTrueGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation } from "../apis/gradeApi";
export { useFetchTypeQuery, useFetchTrueTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation } from "../apis/typeApi";
export { useFetchStoneQuery, useFetchTrueStoneQuery, useFetchStoneByIdQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation } from "../apis/stoneApi";
export { useFetchUOMQuery, useFetchUOMByIdQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } from "../apis/uomApi";
export { useFetchCustomerQuery, useFetchCustomerByIdQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } from "../apis/customerApi";
export { useFetchSupplierQuery, useFetchSupplierByIdQuery, useAddSupplierMutation, useUpdateSupplierMutation, useRemoveSupplierMutation } from "../apis/supplierApi";
export { useFetchStoneDetailsQuery, useFetchStoneDetailsByIdQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation } from "../apis/stoneDetailsApi";
export { useFetchPurchaseQuery ,useAddPurchaseMutation, useFetchPurchaseByIdQuery, useUpdatePurchaseMutation } from "../apis/purchaseApi";