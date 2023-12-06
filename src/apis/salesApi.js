import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";



const salesApi = createApi({
    reducerPath: "sales",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchSales: builder.query({
                providesTags: () => {
                    return [{type: 'Sales', id: "All"}]
                },
                query: () => {
                    return {
                        url: '/sales/get-all-sales',
                        method: 'GET'
                    }
                }
            }),
            fetchTrueSales: builder.query({
                providesTags: () => {
                    return [{type: 'Sales', id: "All"}]
                },
                query: () => {
                    return {
                        url: '/sales/get-all-sales',
                        method: 'GET',
                        params: {status: "O"}
                    }
                }
            }),
            addSales: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Sales", id:"All"}]
                },
                query: (salesData) => {
                    return {
                        url: "/sales/create-sales",
                        method: 'POST',
                        body: salesData
                    }
                }
            }),
            updateSales: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Sales", id:"All"}]
                },
                query: (salesData) => {
                    return {
                        url: "/sales/update-sales",
                        method: "PUT",
                        body: salesData,
                    }
                }
            }),
            removeSales: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Sales", id:"All"}]
                },
                query: (salesData) => {
                    return {
                        url: "/sales/delete-sales",
                        method: 'PUT',
                        body: salesData,
                    };
                },
            }),
        };
    },
});

export const { useAddSalesMutation, useFetchSalesQuery, useFetchTrueSalesQuery, useUpdateSalesMutation, useRemoveSalesMutation } = salesApi;

export { salesApi }