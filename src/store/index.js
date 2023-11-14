import { configureStore } from "@reduxjs/toolkit";
import { brightnessApi } from "../apis/brightnessApi";
import { gradeApi } from "../apis/gradeApi";
import { typeApi } from "../apis/typeApi";
import { stoneApi } from "../apis/stoneApi";
import { uomApi } from "../apis/uomApi";
import { customerApi } from "../apis/customerApi";
import { supplierApi } from "../apis/supplierApi";
import { stoneDetailsApi } from "../apis/stoneDetailsApi";
import { purchaseApi } from "../apis/purchaseApi";
import { salesApi } from "../apis/salesApi";
import { stoneSelectionApi } from "../apis/stoneSelectionApi";
import { returnApi } from "../apis/returnApi";
import { issueApi } from "../apis/issueApi";
import { shareApi } from "../apis/shareApi";
import { damageApi } from "../apis/damageApi";
import { adjustmentApi } from "../apis/adjustmentApi";
import { walletTransitionApi } from "../apis/walletTransitionApi";

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
        [salesApi.reducerPath] : salesApi.reducer,
        [stoneSelectionApi.reducerPath] : stoneSelectionApi.reducer,
        [returnApi.reducerPath] : returnApi.reducer,
        [issueApi.reducerPath] : issueApi.reducer,
        [shareApi.reducerPath] : shareApi.reducer,
        [damageApi.reducerPath] : damageApi.reducer,
        [adjustmentApi.reducerPath] : adjustmentApi.reducer,
        [walletTransitionApi.reducerPath] : walletTransitionApi.reducer,
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
            .concat(purchaseApi.middleware)
            .concat(salesApi.middleware)
            .concat(stoneSelectionApi.middleware)
            .concat(returnApi.middleware)
            .concat(issueApi.middleware)
            .concat(shareApi.middleware)
            .concat(damageApi.middleware)
            .concat(adjustmentApi.middleware)
            .concat(walletTransitionApi.middleware);
    }
});

export { useAddBrightnessMutation, useFetchTrueBrightnessQuery, useFetchBrightnessByIdQuery, useFetchBrightnessQuery, useUpdateBrightnessMutation, useRemoveBrightnessMutation } from "../apis/brightnessApi";
export { useFetchGradeQuery, useFetchTrueGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation } from "../apis/gradeApi";
export { useFetchTypeQuery, useFetchTrueTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation } from "../apis/typeApi";
export { useFetchStoneQuery, useFetchTrueStoneQuery, useFetchStoneByIdQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation } from "../apis/stoneApi";
export { useFetchUOMQuery, useFetchUOMByIdQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } from "../apis/uomApi";
export { useFetchCustomerQuery, useFetchTrueCustomerQuery, useFetchCustomerByIdQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } from "../apis/customerApi";
export { useFetchSupplierQuery, useFetchTrueSupplierQuery, useFetchSupplierByIdQuery, useAddSupplierMutation, useUpdateSupplierMutation, useRemoveSupplierMutation } from "../apis/supplierApi";
export { useFetchStoneDetailsQuery, useFetchStoneDetailsByIdQuery, useFetchPurchaseShareQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation } from "../apis/stoneDetailsApi";
export { useFetchPurchaseIdQuery, useFetchPurchaseQuery, useFetchTruePurchaseQuery, useAddPurchaseMutation, useFetchPurchaseByIdQuery, useUpdatePurchaseMutation, useRemovePurchaseMutation } from "../apis/purchaseApi";
export { useFetchSalesQuery, useFetchTrueSalesQuery, useAddSalesMutation, useUpdateSalesMutation, useRemoveSalesMutation} from "../apis/salesApi";
export { useFetchStoneSelectionQuery, useAddStoneSelectionMutation, useUpdateStoneSelectionMutation } from "../apis/stoneSelectionApi";
export { useFetchReturnQuery, useAddReturnMutation, useUpdateReturnMutation, useRemoveReturnMutation } from "../apis/returnApi";
export { useFetchIssueQuery, useAddIssueMutation, useUpdateIssueMutation, useRemoveIssueMutation } from "../apis/issueApi";
export { useFetchShareQuery, useFetchShareByIdQuery, useAddShareMutation, useUpdateShareMutation, useRemoveShareMutation } from "../apis/shareApi";
export { useFetchDamageIdQuery, useFetchDamageQuery, useFetchDamageByIdQuery, useAddDamageMutation, useUpdateDamageMutation, useRemoveDamageMutation } from "../apis/damageApi";
export { useFetchAdjustmentQuery, useFetchAdjustmentByIdQuery, useAddAdjustmentMutation, useUpdateAdjustmentMutation, useRemoveAdjustMutation } from "../apis/adjustmentApi";
export { useFetchWalletQuery, useFetchWalletTransactionQuery, useFetchWalletTransactionByIdQuery, useAddWalletTransactionMutation, useUpdateWalletTransactionMutation, useRemoveWalletTransactionMutation } from "../apis/walletTransitionApi"
