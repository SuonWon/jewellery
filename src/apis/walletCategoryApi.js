import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

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
                query: () => {
                    return {
                        url: "/wallet-category/get-all-wallet-categories",
                        method: "GET",
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
                        method: "GET"
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
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletCategoryQuery, useFetchTrueWalletCategoryQuery, useFetchWalletCategoryByIdQuery, useAddWalletCategoryMutation, useUpdateWalletCategoryMutation, useRemoveWalletCategoryMutation } = walletCategoryApi;
export { walletCategoryApi };