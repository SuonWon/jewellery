import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const brightnessApi = createApi({
    reducerPath: "brightness",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchBrightness: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/brightness/get-all-stone-brightnesses',
                        method: 'GET',
                    };
                },
            }),
            fetchTrueBrightness: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/v1/brightness/get-true-stone-brightnesses',
                        method: 'GET',
                    }
                }
            }),
            fetchBrightnessById: builder.query({
                query: (brightCode) => {
                    return {
                        url: `/v1/brightness/get-stone-brightness/${brightCode}`,
                        method: 'GET'
                    };
                },
            }),
            addBrightness: builder.mutation({
                invalidatesTags: (result, error, brightData) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: (brightData) => {
                    return {
                        url: 'v1/brightness/create-stone-brightness',
                        method: 'POST',
                        body: {
                            brightCode: brightData.brightCode,
                            brightDesc: brightData.brightDesc,
                            status: brightData.status,
                            createdAt: brightData.createdAt,
                            createdBy: brightData.createdBy,
                            updatedAt: brightData.updatedAt,
                            updatedBy: brightData.updatedBy,
                        },
                    };
                },
            }),
            updateBrightness: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Brightness', id:'All'}]
                },
                query: (brightData) => {
                    return {
                        url: `v1/brightness/update-stone-brightness`,
                        body: {
                            brightCode: brightData.brightCode,
                            brightDesc: brightData.brightDesc,
                            status: brightData.status,
                            createdAt: brightData.createdAt,
                            createdBy: brightData.createdBy,
                            updatedAt: brightData.updatedAt,
                            updatedBy: brightData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeBrightness: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Brightness', id:'All'}]
                },
                query: (brightCode) => {
                    return {
                        url: `v1/brightness/delete-stone-brightness/${brightCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});



export const { useFetchBrightnessQuery, useFetchTrueBrightnessQuery, useFetchBrightnessByIdQuery, useAddBrightnessMutation, useUpdateBrightnessMutation, useRemoveBrightnessMutation } = brightnessApi;
export { brightnessApi };