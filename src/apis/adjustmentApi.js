import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const adjustmentApi = createApi({
    reducerPath: "adjustment",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchAdjustment: builder.query({
                providesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/adjustment/get-all-adjustments",
                        method: "GET"
                    };
                },
            }),
            fetchAdjustmentById: builder.query({
                providesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (adjustId) => {
                    return {
                        url: `/adjustment/get-adjustment/${adjustId}`,
                        method: "GET"
                    };
                },
            }),
            addAdjustment: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (adjustData) => {
                    return {
                        url: "/adjustment/create-adjustment",
                        method: "POST",
                        body: adjustData,
                    };
                },
            }),
            updateAdjustment: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (adjustData) => {
                    return {
                        url: "/adjustment/update-adjustment",
                        method: "PUT",
                        body: adjustData
                    };
                },
            }),
            removeAdjust: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (adjustData) => {
                    return {
                        url: "/adjustment/delete-adjustment",
                        method: "PUT",
                        body: adjustData
                    };
                },
            })
        };
    },
});


export const { useFetchAdjustmentQuery, useFetchAdjustmentByIdQuery, useAddAdjustmentMutation, useUpdateAdjustmentMutation, useRemoveAdjustMutation } = adjustmentApi;
export { adjustmentApi };