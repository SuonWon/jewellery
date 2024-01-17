import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const salesApi = createApi({
    reducerPath: "sales",
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
            fetchSales: builder.query({
                providesTags: () => {
                    return [{type: 'Sales', id: "All"}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: '/sales/get-all-sales'  + query,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            fetchTrueSales: builder.query({
                providesTags: () => {
                    return [{type: 'Sales', id: "All"}]
                },
                query: () => {
                    return {
                        url: '/sales/get-true-sales',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            fetchSalesCount: builder.query({
                providesTags: () => {
                    return [{type: 'Sales', id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: '/sales/get-count' + query,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: salesData,
                    };
                },
            }),
        };
    },
});

export const { useAddSalesMutation, useFetchSalesQuery, useFetchTrueSalesQuery, useUpdateSalesMutation, useRemoveSalesMutation, useFetchSalesCountQuery } = salesApi;

export { salesApi }