import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const returnApi = createApi({
    reducerPath: "return",
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: returnData,
                    }
                }
            })
        };
    },
});

export const { useFetchReturnQuery, useFetchReturnByIdQuery, useAddReturnMutation, useUpdateReturnMutation, useRemoveReturnMutation, useFetchReturnCountQuery, useFetchReturnByInvoiceQuery } = returnApi;
export { returnApi };