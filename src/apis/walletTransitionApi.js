import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const walletTransitionApi = createApi({
    reducerPath: "walletTransition",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
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
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=true${filterData.shareCode === 0 ? '' : `&shareCode=${filterData.shareCode}`}${filterData.walletName === '' ? '' : `&walletName=${filterData.walletName}`}${filterData.category === 0 ? '' : `&category=${filterData.category}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: `/transaction/get-all-transactions${query}`,
                        // params: {
                        //     status: walletData.status,
                        //     walletCode: walletData.walletCode
                        // },
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchWalletTransactionCount: builder.query({
                providesTags: () => {
                    return [{type: "WalletTransaction", id: "All"}]
                },
                query: (filterData) => {
                    console.log(filterData);
                    const query = `?status=true${filterData.shareCode === 0 ? '' : `&shareCode=${filterData.shareCode}`}${filterData.walletName === '' ? '' : `&walletName=${filterData.walletName}`}${filterData.category === 0 ? '' : `&walletName=${filterData.category}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: `/transaction/get-count${query}`,
                        // params: {
                        //     status: walletData.status,
                        //     walletCode: walletData.walletCode
                        // },
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: transactionData,
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletTransactionQuery, useFetchWalletTransactionByIdQuery, useAddWalletTransactionMutation, useUpdateWalletTransactionMutation, useRemoveWalletTransactionMutation, useFetchWalletTransactionCountQuery } = walletTransitionApi;
export { walletTransitionApi };