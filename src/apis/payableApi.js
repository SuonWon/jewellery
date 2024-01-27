import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const payableApi = createApi({
    reducerPath: "payable",
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
            fetchPayable: builder.query({
                providesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (invoiceNo) => {
                    return {
                        url: `/payable/get-payables`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: {
                            invoiceNo: invoiceNo,
                            status: "O"
                        },
                    };
                },
            }),
            fetchPayableById: builder.query({
                providesTags: () => {
                    return [{type: "Payable", id: "All"}]
                },
                query: (payId) => {
                    return {
                        url: `/payable/get-payable/${payId}`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            // fetchOwnerWallet: builder.query({
            //     query: () => {
            //         return {
            //             url: "/payable/get-owner-wallets",
            //             method: "GET",
            //             // headers: {
            //             //     "Authorization": token
            //             // },
            //         }
            //     }
            // }),
            addPayable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (payData) => {
                    console.log(payData);
                    return {
                        url: "/payable/create-payable",
                        method: "POST",
                        body: payData
                    };
                },
            }),
            updatePayable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (payData) => {
                    return {
                        url: "/payable/update-payable",
                        method: "PUT",
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: payData,
                    };
                },
            }),
            removePayable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (payData) => {
                    return {
                        url: "/payable/delete-payable",
                        method: "PUT",
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: payData,
                    };
                },
            }),
        };
    },
});

export const { useFetchPayableQuery, useFetchPayableByIdQuery, useAddPayableMutation, useUpdatePayableMutation, useRemovePayableMutation } = payableApi;
export { payableApi };