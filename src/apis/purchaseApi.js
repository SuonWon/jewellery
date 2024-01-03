import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl, pause } from "../const";
import moment from "moment";

const purchaseApi = createApi({
    reducerPath: "purchase",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
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
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}&isComplete=${filterData.isComplete}${filterData.start_date == null ? '' : `&start_date=${moment(filterData.start_date).toISOString()}`}${filterData.end_date == null ? '' : `&end_date=${moment(filterData.end_date).toISOString()}`}`
                    return {
                        url: '/purchase/get-all-purchases'+ query,
                        method: 'GET',
                        //params: filterData
                    };
                },
            }),
            fetchTruePurchase: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: () => {
                    const data = {
                        skip: 0,
                        take: 0,
                        status: 'O',
                        isComplete: 'F'
                    }
                    return {
                        url: '/purchase/get-all-purchases',
                        method: 'GET',
                        params: data
                    }
                }
            }),
            fetchPurchaseCount: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: (filterData) => {

                    const query = `?status=${filterData.status}&isComplete=${filterData.isComplete}${filterData.start_date == null ? '' : `&start_date=${moment(filterData.start_date).toISOString()}`}${filterData.end_date == null ? '' : `&end_date=${moment(filterData.end_date).toISOString()}`}`
                    return {
                        url: '/purchase/get-count'+query,
                        method: 'GET',
                        //params: data
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

export const { useFetchPurchaseIdQuery, useAddPurchaseMutation, useFetchTruePurchaseQuery, useFetchPurchaseQuery, useFetchPurchaseByIdQuery, useUpdatePurchaseMutation, useUpdatePurchaseStatusMutation, useRemovePurchaseMutation, useFetchPurchaseCountQuery } = purchaseApi; 
export {purchaseApi};