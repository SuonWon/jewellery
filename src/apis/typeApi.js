import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const typeApi = createApi({
    reducerPath: "stoneType",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchType: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/type/get-all-stone-types',
                        method: 'GET',
                        params: filterData
                    };
                },
            }),
            fetchTypeCount: builder.query({
                providesTags: () => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/type/get-count',
                        method: 'GET',
                        params: data
                    };
                },
            }),
            fetchTrueType: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/type/get-true-stone-types',
                        method: 'GET'
                    }
                }
            }),
            fetchTypeById: builder.query({
                query: (typeCode) => {
                    return {
                        url: `/type/get-stone-type/${typeCode}`,
                        method: 'GET'
                    };
                },
            }),
            addType: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: (typeData) => {
                    return {
                        url: '/type/create-stone-type',
                        method: 'POST',
                        body: {
                            typeCode: typeData.typeCode,
                            typeDesc: typeData.typeDesc,
                            status: typeData.status,
                            createdAt: typeData.createdAt,
                            createdBy: typeData.createdBy,
                            updatedAt: typeData.updatedAt,
                            updatedBy: typeData.updatedBy,
                        },
                    };
                },
            }),
            updateType: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Type', id:'All'}]
                },
                query: (typeData) => {
                    return {
                        url: `/type/update-stone-type`,
                        body: {
                            typeCode: typeData.typeCode,
                            typeDesc: typeData.typeDesc,
                            status: typeData.status,
                            createdAt: typeData.createdAt,
                            createdBy: typeData.createdBy,
                            updatedAt: typeData.updatedAt,
                            updatedBy: typeData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeType: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Type', id:'All'}]
                },
                query: (typeCode) => {
                    return {
                        url: `/type/delete-stone-type/${typeCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchTypeQuery, useFetchTrueTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation, useFetchTypeCountQuery } = typeApi;
export { typeApi };