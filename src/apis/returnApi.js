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
                query: () => {
                    return {
                        url: "/return/get-all-returns",
                        method: "GET"
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

export const { useFetchReturnQuery, useFetchReturnByIdQuery, useAddReturnMutation, useUpdateReturnMutation, useRemoveReturnMutation } = returnApi;
export { returnApi };