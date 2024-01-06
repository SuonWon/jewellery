import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const returnApi = createApi({
    reducerPath: "return",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return{
            fetchReturn: builder.query({
                providesTags: () => {
                    return[{type: "Return", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}&return_type=${filterData.return_type}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/return/get-all-returns" + query,
                        method: "GET",
                    };
                },
            }),
            fetchReturnById: builder.query({
                providesTags: () => {
                    return [{ type: 'Return', id: 'All' }];
                },
                query: (returnId) => {
                    return {
                        url: `/return/get-return/${returnId}`,
                        method: "GET",
                    };
                },
            }),
            fetchReturnCount: builder.query({
                providesTags: () => {
                    return[{type: "Return", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=${filterData.status}&return_type=${filterData.return_type}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/return/get-count" + query,
                        method: "GET",
                    };
                },
            }),
            fetchReturnByInvoice: builder.query({
                providesTags: () => {
                    return [{ type: 'Return', id: 'All' }];
                },
                query: (invoice) => {
                    return {
                        url: `/return/get-return-by-invoice/${invoice}`,
                        method: "GET",
                    };
                },
            }),
            addReturn: builder.mutation({
                invalidatesTags: () => {
                    return[{type: "Return", id:"All"}]
                },
                query: (returnData) => {
                    return {
                        url: "/return/create-return",
                        method: "POST",
                        body: returnData,
                    };
                },
            }),
            updateReturn: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Return", id:"All"}]
                },
                query: (returnData) => {
                    return{
                        url: "/return/update-return",
                        method: "PUT",
                        body: returnData,
                    };
                },
            }),
            removeReturn: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Return", id:"All"}]
                },
                query: (returnData) => {
                    return{
                        url: "/return/delete-return",
                        method: "PUT",
                        body: returnData,
                    }
                }
            })
        };
    },
});

export const { useFetchReturnQuery, useFetchReturnByIdQuery, useAddReturnMutation, useUpdateReturnMutation, useRemoveReturnMutation, useFetchReturnCountQuery, useFetchReturnByInvoiceQuery } = returnApi;
export { returnApi };