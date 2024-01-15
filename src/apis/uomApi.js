import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

const uomApi = createApi({
    reducerPath: "unit",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchUOM: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'UOM', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/unit/get-all-units',
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
            fetchUOMById: builder.query({
                query: (unitCode) => {
                    return {
                        url: `/unit/get-unit/${unitCode}`,
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        }
                    };
                },
            }),
            addUOM: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'UOM', id: 'All'}]
                },
                query: (unitData) => {
                    console.log(unitData);
                    return {
                        url: '/unit/create-unit',
                        method: 'POST',
                        headers: {
                            "Authorization": token
                        },
                        body: {
                            unitCode: unitData.unitCode,
                            unitDesc: unitData.unitDesc,
                            createdAt: unitData.createdAt,
                            createdBy: unitData.createdBy,
                            updatedAt: unitData.updatedAt,
                            updatedBy: unitData.updatedBy,
                        },
                    };
                },
            }),
            updateUOM: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'UOM', id:'All'}]
                },
                query: (unitData) => {
                    return {
                        url: `/unit/update-unit`,
                        headers: {
                            "Authorization": token
                        },
                        body: {
                            unitCode: unitData.unitCode,
                            unitDesc: unitData.unitDesc,
                            createdAt: unitData.createdAt,
                            createdBy: unitData.createdBy,
                            updatedAt: unitData.updatedAt,
                            updatedBy: unitData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeUOM: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'UOM', id:'All'}]
                },
                query: (unitCode) => {
                    return {
                        url: `/unit/delete-unit/${unitCode}`,
                        method: 'DELETE',
                        headers: {
                            "Authorization": token
                        }
                    };
                },
            }),
        }
    }
});

export const { useFetchUOMQuery, useFetchUOMByIdQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } = uomApi;
export { uomApi };