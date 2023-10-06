import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


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
                        url:'/v1/unit/get-all-units',
                        method: 'GET',
                    };
                },
            }),
            fetchUOMById: builder.query({
                query: (unitCode) => {
                    return {
                        url: `/v1/unit/get-unit/${unitCode}`,
                        method: 'GET'
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
                        url: '/v1/unit/create-unit',
                        method: 'POST',
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
                        url: `/v1/unit/update-unit`,
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
                        url: `/v1/unit/delete-unit/${unitCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchUOMQuery, useFetchUOMByIdQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } = uomApi;
export { uomApi };