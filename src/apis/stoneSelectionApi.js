import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            })
        };
    },
});

export const { useFetchStoneSelectionQuery, useFetchStoneSelectionByIdQuery, useAddStoneSelectionMutation, useUpdateStoneSelectionMutation, useRemoveStoneSelectionMutation } = stoneSelectionApi
export { stoneSelectionApi };