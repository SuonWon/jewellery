import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const receivableApi = createApi({
    reducerPath: "receivable",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchReceivable: builder.query({
                providesTags: () => {
                    return [{type: "Receivable", id: "All"}];
                },
                query: (invoiceNo) => {
                    return {
                        url: `/receivable/get-receivable`,
                        method: "GET",
                        params: {
                            invoiceNo: invoiceNo,
                            status: "O"
                        },
                    };
                },
            }),
            fetchReceivableById: builder.query({
                providesTags: () => {
                    return [{type: "Receivable", id: "All"}];
                },
                query: (receiveId) => {
                    return {
                        url: `/receivable/get-receivable/${receiveId}`,
                        method: "GET",
                    };
                },
            }),
            addReceivable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Receivable", id: "All"}];
                },
                query: (receiveData) => {
                    return {
                        url: "/receivable/create-receivable",
                        method: "POST",
                        body: receiveData,
                    };
                },
            }),
            updateReceivable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Receivable", id: "All"}];
                },
                query: (receiveData) => {
                    return {
                        url: "/receivable/update-receivable",
                        method: "PUT",
                        body: receiveData,
                    };
                },
            }),
            removeReceivable: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Receivable", id: "All"}];
                },
                query: (receiveData) => {
                    return {
                        url: "/receivable/delete-receivable",
                        method: "PUT",
                        body: receiveData,
                    };
                },
            }),
        }
    },
});

export const { useFetchReceivableQuery, useFetchReceivableByIdQuery, useAddReceivableMutation, useUpdateReceivableMutation, useRemoveReceivableMutation } = receivableApi;
export { receivableApi };