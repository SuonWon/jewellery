import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
                        body: receiveData,
                    };
                },
            }),
        }
    },
});

export const { useFetchReceivableQuery, useFetchReceivableByIdQuery, useAddReceivableMutation, useUpdateReceivableMutation, useRemoveReceivableMutation } = receivableApi;
export { receivableApi };