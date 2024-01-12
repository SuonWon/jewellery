import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const walletApi = createApi({
    reducerPath: "wallet",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchWallet: builder.query({
                providesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (filterData) => {
                    return {
                        url: "/wallet/get-all-wallets",
                        method: "GET",
                        params: filterData
                    };
                },
            }),
            fetchWalletCount: builder.query({
                providesTags: () => {
                    return[{type: 'Wallet', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: "/wallet/get-count",
                        method: 'GET',
                        params: data
                    };
                },
            }),
            fetchWalletById: builder.query({
                providesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (walletCode) => {
                    return {
                        url: `/wallet/get-wallet/${walletCode}`,
                        method: "GET",
                    };
                },
            }),
            fetchTrueWallet: builder.query({
                providesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/wallet/get-true-wallets",
                        method: "GET",
                    };
                },
            }),
            fetchWalletNames: builder.query({
                query: () => {
                    return {
                        url: "/wallet/get-wallet-name-group-by",
                        method: "GET",
                    }
                }
            }),
            addWallet: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (walletData) => {
                    return {
                        url: "/wallet/create-wallet",
                        method: "POST",
                        body: walletData,
                    };
                },
            }),
            updateWallet: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (walletData) => {
                    return {
                        url: "/wallet/update-wallet",
                        method: "PUT",
                        body: walletData,
                    };
                },
            }),
            removeWallet: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (walletId) => {
                    return {
                        url: `/wallet/delete-wallet/${walletId}`,
                        method: "DELETE"
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletQuery, useFetchWalletByIdQuery, useFetchTrueWalletQuery, useFetchWalletNamesQuery, useAddWalletMutation, useUpdateWalletMutation, useRemoveWalletMutation, useFetchWalletCountQuery } = walletApi;
export { walletApi };