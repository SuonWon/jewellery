import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const typeApi = createApi({
    reducerPath: "stoneType",
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
            fetchType: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Type', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/type/get-all-stone-types',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            fetchTypeById: builder.query({
                query: (typeCode) => {
                    return {
                        url: `/type/get-stone-type/${typeCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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

export const { useFetchTypeQuery, useFetchTrueTypeQuery, useFetchTypeByIdQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation, useFetchTypeCountQuery } = typeApi;
export { typeApi };