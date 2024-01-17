import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const adjustmentApi = createApi({
    reducerPath: "adjustment",
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
            fetchAdjustment: builder.query({
                providesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/adjustment/get-all-adjustments" + query,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
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
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchAdjustmentCount: builder.query({
                providesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/adjustment/get-count" + query,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: adjustData
                    };
                },
            })
        };
    },
});


export const { useFetchAdjustmentQuery, useFetchAdjustmentByIdQuery, useAddAdjustmentMutation, useUpdateAdjustmentMutation, useRemoveAdjustMutation, useFetchAdjustmentCountQuery } = adjustmentApi;
export { adjustmentApi };