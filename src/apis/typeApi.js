import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const typeApi = createApi({
    reducerPath: "stoneType",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3005/",
    }),
    endpoints(builder) {
        return {
            fetchType: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/type/get-all-stone-types',
                        method: 'GET',
                    };
                },
            }),
            fetchTrueType: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/v1/type/get-true-stone-types',
                        method: 'GET'
                    }
                }
            }),
            fetchTypeById: builder.query({
                query: (typeCode) => {
                    return {
                        url: `/v1/type/get-stone-type/${typeCode}`,
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
                        url: '/v1/type/create-stone-type',
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
                        url: `/v1/type/update-stone-type`,
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
                        url: `/v1/type/delete-stone-type/${typeCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchTypeQuery, useFetchTrueTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation } = typeApi;
export { typeApi };