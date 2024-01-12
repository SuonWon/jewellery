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
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=true${filterData.shareCode == '' ? '' : `&shareCode=${filterData.shareCode}`}${filterData.walletName == '' ? '' : `&walletName=${filterData.walletName}`}${filterData.category == '' ? '' : `&category=${filterData.category}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: `/transaction/get-all-transactions${query}`,
                        // params: {
                        //     status: walletData.status,
                        //     walletCode: walletData.walletCode
                        // },
                        method: "GET",
                    };
                },
            }),
            fetchWalletTransactionCount: builder.query({
                providesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=true${filterData.shareCode == '' ? '' : `&shareCode=${filterData.shareCode}`}${filterData.walletName == '' ? '' : `&walletName=${filterData.walletName}`}${filterData.category == '' ? '' : `&walletName=${filterData.category}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: `/transaction/get-count${query}`,
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

export const { useFetchWalletTransactionQuery, useFetchWalletTransactionByIdQuery, useAddWalletTransactionMutation, useUpdateWalletTransactionMutation, useRemoveWalletTransactionMutation, useFetchWalletTransactionCountQuery } = walletTransitionApi;
export { walletTransitionApi };