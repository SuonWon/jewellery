import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const purchaseApi = createApi({
    reducerPath: "purchase",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchPurchase: builder.query({
                query: () => {
                    return {
                        url: '/purchase/get-all-purchases',
                        method: 'GET'
                    };
                },
            }),
            fetchTruePurchase: builder.query({
                query: () => {
                    return {
                        url: '/purchase/get-true-purchases/?status=O',
                        method: 'GET'
                    }
                }
            }),
            fetchPurchaseById: builder.query({
                query: (purchaseNo) => {
                    return {
                        url: `/purchase/get-purchse/${purchaseNo}`,
                        method: 'GET'
                    }
                }
            }),
            addPurchase: builder.mutation({
                query: (purchaseData) => {
                    return {
                        url: '/purchase/create-purchase',
                        method: 'POST',
                        body: {
                            ...purchaseData,
                            purchaseDetails: purchaseData.purchaseDetail
                        }
                    }
                }
            }),
            updatePurchase: builder.mutation({
                query: (purchaseData) => {
                    return {
                        url: '/purchase/update-purchase',
                        method: 'PUT',
                        body: purchaseData
                    }
                }
            }),
            removePurchase: builder.mutation({
                query: (purchaseData) => {
                    return {
                        url: '/purchase/delete-purchase',
                        method: 'PUT',
                        body: {
                            ...purchaseData
                        }
                    }
                }
            })
        };
    },
})

export const { useAddPurchaseMutation, useFetchTruePurchaseQuery, useFetchPurchaseQuery, useFetchPurchaseByIdQuery, useUpdatePurchaseMutation, useRemovePurchaseMutation } = purchaseApi; 
export {purchaseApi};