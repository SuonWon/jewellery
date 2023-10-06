import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const stoneApi = createApi({
    reducerPath: "stone",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchStone: builder.query({
                providesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/stone/get-all-stones',
                        method: 'GET',
                    };
                },
            }),
            fetchTrueStone: builder.query({
                providesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/v1/stone/get-true-stones',
                        method: 'GET'
                    }
                }
            }),
            fetchStoneById: builder.query({
                query: (stoneCode) => {
                    return {
                        url: `/v1/stone/get-stone/${stoneCode}`,
                        method: 'GET'
                    };
                },
            }),
            addStone: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: (stoneData) => {
                    return {
                        url: '/v1/stone/create-stone',
                        method: 'POST',
                        body: {
                            stoneDesc: stoneData.stoneDesc,
                            remark: stoneData.remark,
                            status: stoneData.status,
                            createdAt: stoneData.createdAt,
                            createdBy: stoneData.createdBy,
                            updatedAt: stoneData.updatedAt,
                            updatedBy: stoneData.updatedBy,
                        },
                    };
                },
            }),
            updateStone: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Stone', id:'All'}]
                },
                query: (stoneData) => {
                    return {
                        url: `/v1/stone/update-stone`,
                        body: {
                            stoneCode: stoneData.stoneCode,
                            stoneDesc: stoneData.stoneDesc,
                            remark: stoneData.remark,
                            status: stoneData.status,
                            createdAt: stoneData.createdAt,
                            createdBy: stoneData.createdBy,
                            updatedAt: stoneData.updatedAt,
                            updatedBy: stoneData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeStone: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Stone', id:'All'}]
                },
                query: (stoneCode) => {
                    return {
                        url: `/v1/stone/delete-stone/${stoneCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchStoneQuery, useFetchTrueStoneQuery, useFetchStoneByIdQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation } = stoneApi;
export { stoneApi };