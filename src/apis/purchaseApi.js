import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const purchaseApi = createApi({
    reducerPath: "purchase",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3005/"
    }),
    endpoints(builder) {
        return {
            fetchPurchase: builder.query({
                query: () => {
                    return {
                        url: '/v1/purchase/get-all-purchases',
                        method: 'GET'
                    };
                },
            }),
            fetchTruePurchase: builder.query({
                query: () => {
                    return {
                        url: '/v1/purchase/get-true-purchases',
                        method: 'GET'
                    }
                }
            }),
            fetchPurchaseById: builder.query({
                query: (purchaseNo) => {
                    return {
                        url: `/v1/purchase/get-purchase/${purchaseNo}`,
                        method: 'GET'
                    }
                }
            }),
            addPurchase: builder.mutation({
                query: (purchaseData) => {
                    return {
                        url: '/v1/purchase/create-purchase',
                        method: 'POST',
                        body: {
                            ...purchaseData,
                            purchaseDetails: purchaseData.purchaseDetail
                        }
                    }
                }
            })
        };
    },
})

export const { useAddPurchaseMutation } = purchaseApi; 
export {purchaseApi};