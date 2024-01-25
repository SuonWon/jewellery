import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const stoneApi = createApi({
    reducerPath: "stone",
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
            fetchStone: builder.query({
                providesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/stone/get-all-stones',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: filterData
                    };
                },
            }),
            fetchStoneCount: builder.query({
                providesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/stone/get-count',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: data
                    };
                },
            }),
            fetchTrueStone: builder.query({
                providesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/stone/get-true-stones',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            fetchStoneById: builder.query({
                query: (stoneCode) => {
                    return {
                        url: `/stone/get-stone/${stoneCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            addStone: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Stone', id: 'All'}]
                },
                query: (stoneData) => {
                    return {
                        url: '/stone/create-stone',
                        method: 'POST',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        url: `/stone/update-stone`,
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        url: `/stone/delete-stone/${stoneCode}`,
                        method: 'DELETE',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
        }
    }
});

export const { useFetchStoneQuery, useFetchTrueStoneQuery, useFetchStoneByIdQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation, useFetchStoneCountQuery } = stoneApi;
export { stoneApi };