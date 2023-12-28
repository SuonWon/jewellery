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
                query: () => {
                    return {
                        url: "/wallet/get-all-wallets",
                        method: "GET",
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

export const { useFetchWalletQuery, useFetchWalletByIdQuery, useAddWalletMutation, useUpdateWalletMutation, useRemoveWalletMutation } = walletApi;
export { walletApi };