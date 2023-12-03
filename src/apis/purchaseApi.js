import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl, pause } from "../const";

const purchaseApi = createApi({
    reducerPath: "purchase",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        fetchFn: async (...argus) => {
            await pause(2000);
            return fetch(...argus);
        }
    }),
    endpoints(builder) {
        return {
            fetchPurchaseId: builder.query({
                query: () => {
                    return {
                        url: '/purchase/get-id',
                        method: 'GET'
                    };
                },
            }),
            fetchPurchase: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/purchase/get-all-purchases',
                        method: 'GET'
                    };
                },
            }),
            fetchTruePurchase: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/purchase/get-true-purchases/?status=O',
                        method: 'GET'
                    }
                }
            }),
            fetchPurchaseById: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: (purchaseNo) => {
                    return {
                        url: `/purchase/get-purchase/${purchaseNo}`,
                        method: 'GET'
                    }
                }
            }),
            addPurchase: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Purchase", id: "All"}]
                },
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
                invalidatesTags: () => {
                    return [{type: "Purchase", id: "All"}]
                },
                query: (purchaseData) => {
                    return {
                        url: '/purchase/update-purchase',
                        method: 'PUT',
                        body: purchaseData
                    }
                }
            }),
            updatePurchaseStatus: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Purchase", id: "All"}]
                },
                query: (purchaseData) => {
                    return {
                        url: "/purchase/update-purchase-finish",
                        method: "PUT",
                        body: purchaseData,
                    };
                },
            }),
            removePurchase: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Purchase", id: "All"}]
                },
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

export const { useFetchPurchaseIdQuery, useAddPurchaseMutation, useFetchTruePurchaseQuery, useFetchPurchaseQuery, useFetchPurchaseByIdQuery, useUpdatePurchaseMutation, useUpdatePurchaseStatusMutation, useRemovePurchaseMutation } = purchaseApi; 
export {purchaseApi};