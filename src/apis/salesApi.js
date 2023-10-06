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
                query: () => {
                    return {
                        url: '/sales/get-all-sales',
                        method: 'GET'
                    }
                }
            }),
            fetchTrueSales: builder.query({
                query: () => {
                    return {
                        url: '/sales/get-true-sales',
                        method: 'GET'
                    }
                }
            }),
            addSales: builder.mutation({
                query: (salesData) => {
                    return {
                        url: "/sales/create-sales",
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