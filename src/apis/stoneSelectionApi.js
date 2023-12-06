import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const stoneSelectionApi = createApi({
    reducerPath: "stoneSelection",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchStoneSelection: builder.query({
                providesTags: () => {
                    return[{type: "StoneSelection", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/stone-selection/get-all-stone-selection",
                        method: "GET",
                    };
                },
            }),
            fetchStoneSelectionById: builder.query({
                providesTags: () => {
                    return[{type: 'StoneSelection', id: "All"}]
                },
                query: (selectionId) => {
                    return {
                        url: `/stone-selection/get-stone-selection/${selectionId}`,
                        method: "GET",
                    };
                },
            }),
            addStoneSelection: builder.mutation({
                invalidatesTags: () => {
                    return [{ type: 'StoneSelection', id: 'All' }];
                },
                query: (selectionData) => {
                    return {
                        url: "/stone-selection/create-stone-selection",
                        method: "POST",
                        body: selectionData,
                    };
                },
            }),
            updateStoneSelection: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "StoneSelection", id:"All"}]
                },
                query: (selectionData) => {
                    return {
                        url: "/stone-selection/update-stone-selection",
                        method: "PUT",
                        body: selectionData,
                    };
                },
            }),
            removeStoneSelection: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "StoneSelection", id:"All"}]
                },
                query: (selectionId) => {
                    return {
                        url: `/stone-selection/update-stone-selection${selectionId}`,
                        method: "DELETE",
                    };
                },
            })
        };
    },
});

export const { useFetchStoneSelectionQuery, useFetchStoneSelectionByIdQuery, useAddStoneSelectionMutation, useUpdateStoneSelectionMutation, useRemoveStoneSelectionMutation } = stoneSelectionApi
export { stoneSelectionApi };