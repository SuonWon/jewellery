import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl, pause } from "../const";
import moment from "moment";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

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
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
            fetchPurchase: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}&isComplete=${filterData.isComplete}&paidStatus=${filterData.paidStatus}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: '/purchase/get-all-purchases'+ query,
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
                        params: data
                    }
                }
            }),
            fetchPurchaseCount: builder.query({
                providesTags: () => {
                    return [{type: 'Purchase', id: 'All'}]
                },
                query: (filterData) => {

                    const query = `?status=${filterData.status}&isComplete=${filterData.isComplete}&paidStatus=${filterData.paidStatus}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: '/purchase/get-count'+query,
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
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
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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