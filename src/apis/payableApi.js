import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const payableApi = createApi({
    reducerPath: "payable",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchPayable: builder.query({
                providesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (invoiceNo) => {
                    return {
                        url: `/payable/get-payables/${invoiceNo}`,
                        method: "GET"
                    };
                },
            }),
            fetchPayableById: builder.query({
                providesTags: () => {
                    return [{type: "Payable", id: "All"}]
                },
                query: (payId) => {
                    return {
                        url: `/v1/payable/get-payable/${payId}`,
                        method: "GET"
                    }
                }
            }),
            addPayable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Payable", id: "All"}];
                },
                query: (payData) => {
                    return {
                        url: "/payable/create-payable",
                        method: "POST",
                        body: payData,
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
                        url: "",
                        method: "PUT",
                        body: payData,
                    };
                },
            }),
        };
    },
});

export const { useFetchPayableQuery, useFetchPayableByIdQuery, useAddPayableMutation, useUpdatePayableMutation, useRemovePayableMutation } = payableApi;
export { payableApi };