import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const salesApi = createApi({
    reducerPath: "sales",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3005/"
    }),
    endpoints(builder) {
        return {
            fetchSales: builder.query({
                query: () => {
                    return {
                        url: '/v1/sales/get-all-sales',
                        method: 'GET'
                    }
                }
            }),
            fetchTrueSales: builder.query({
                query: () => {
                    return {
                        url: '/v1/sales/get-true-sales',
                        method: 'GET'
                    }
                }
            }),
            addSales: builder.mutation({
                query: (salesData) => {
                    return {
                        url: "/v1/sales/create-sales",
                        method: 'POST',
                        body: salesData
                    }
                }
            })
        }
    }
});

export const { useAddSalesMutation, useFetchSalesQuery, useFetchTrueSalesQuery } = salesApi;

export { salesApi }