import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const walletApi = createApi({
    reducerPath: "wallet",
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
            fetchWallet: builder.query({
                providesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: (filterData) => {
                    return {
                        url: "/wallet/get-all-wallets",
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
            fetchOwnerWallet: builder.query({
                providesTags: () => {
                    return [{type: "Wallet", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/wallet/get-owner-wallets",
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        method: "DELETE",
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
        };
    },
});

export const { useFetchWalletQuery, useFetchWalletByIdQuery, useFetchTrueWalletQuery, useFetchWalletNamesQuery, useAddWalletMutation, useUpdateWalletMutation, useRemoveWalletMutation, useFetchWalletCountQuery, useFetchOwnerWalletQuery } = walletApi;
export { walletApi };