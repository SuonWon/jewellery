import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

const walletCategoryApi = createApi({
    reducerPath: "walletCategory",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchWalletCategory: builder.query({
                providesTags: () => {
                    return [{type: "WalletCategory", id: "All"}]
                },
                query: (filterData) => {
                    return {
                        url: "/wallet-category/get-all-wallet-categories",
                        method: "GET",
                        headers: {
                            "Authorization": token
                        },
                        params: filterData
                    };
                },
            }),
            fetchWalletCategoryCount: builder.query({
                providesTags: () => {
                    return[{type: 'WalletCategory', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/wallet-category/get-count',
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                        params: data
                    };
                },
            }),
            fetchTrueWalletCategory: builder.query({
                providesTags: () => {
                    return [{type: "WalletCategory", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/wallet-category/get-true-wallet-categories",
                        method: "GET",
                        headers: {
                            "Authorization": token
                        }
                    }
                }
            }),
            fetchWalletCategoryById: builder.query({
                providesTags: () => {
                    return [{type: "WalletCategory", id: "Single"}]
                },
                query: (id) => {
                    return {
                        url: `/wallet-category/get-wallet-category/${id}`,
                        method: "GET",
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
            addWalletCategory: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletCategory", id: "All"}]
                },
                query: (queryData) => {
                    return {
                        url: "/wallet-category/create-wallet-category",
                        method: "POST",
                        headers: {
                            "Authorization": token
                        },
                        body: queryData,
                    };
                },
            }),
            updateWalletCategory: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletCategory", id: "All"}]
                },
                query: (queryData) => {
                    return {
                        url: "/wallet-category/update-wallet-category",
                        method: "PUT",
                        headers: {
                            "Authorization": token
                        },
                        body: queryData,
                    };
                },
            }),
            removeWalletCategory: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletCategory", id: "All"}]
                },
                query: (id) => {
                    return {
                        url: `/wallet-category/delete-wallet-category/${id}`,
                        method: "DELETE",
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletCategoryQuery, useFetchTrueWalletCategoryQuery, useFetchWalletCategoryByIdQuery, useAddWalletCategoryMutation, useUpdateWalletCategoryMutation, useRemoveWalletCategoryMutation, useFetchWalletCategoryCountQuery } = walletCategoryApi;
export { walletCategoryApi };