import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const walletTransitionApi = createApi({
    reducerPath: "walletTransition",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            // fetchWallet: builder.query({
            //     query: () => {
            //         return {
            //             url: "/wallet/get-all-wallets",
            //             method: "GET",
            //         }
            //     }
            // }),
            fetchWalletTransaction: builder.query({
                providesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (walletData) => {
                    console.log(walletData);
                    return {
                        url: `/transaction/get-all-transactions?status=true&walletCode=${walletData.walletCode}`,
                        // params: {
                        //     status: walletData.status,
                        //     walletCode: walletData.walletCode
                        // },
                        method: "GET",
                    };
                },
            }),
            fetchWalletTransactionById: builder.query({
                providesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (transactionId) => {
                    return {
                        url: `/transaction/get-transaction/${transactionId}`,
                        method: "GET",
                    };
                },
            }),
            addWalletTransaction: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (transactionData) => {
                    return {
                        url: "/transaction/create-transaction",
                        method: "POST",
                        body: transactionData,
                    };
                },
            }),
            updateWalletTransaction: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (transactionData) => {
                    return {
                        url: "/transaction/update-transaction",
                        method: "PUT",
                        body: transactionData,
                    };
                },
            }),
            removeWalletTransaction: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (transactionData) => {
                    return {
                        url: "/transaction/delete-transaction",
                        method: "PUT",
                        body: transactionData,
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletTransactionQuery, useFetchWalletTransactionByIdQuery, useAddWalletTransactionMutation, useUpdateWalletTransactionMutation, useRemoveWalletTransactionMutation } = walletTransitionApi;
export { walletTransitionApi };