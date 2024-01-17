import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";
import { useAuthUser } from "react-auth-kit";

//const token = 'Bearer ' + Cookies.get('_auth');

const brightnessApi = createApi({
    reducerPath: "brightness",
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
            fetchBrightness: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/brightness/get-all-stone-brightnesses',
                        method: 'GET',
                        params: filterData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchBrightnessCount: builder.query({
                providesTags: () => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/brightness/get-count',
                        method: 'GET',
                        params: data,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchTrueBrightness: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/brightness/get-true-stone-brightnesses',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // }
                    }
                }
            }),
            fetchBrightnessById: builder.query({
                query: (brightCode) => {
                    return {
                        url: `/brightness/get-stone-brightness/${brightCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            addBrightness: builder.mutation({
                invalidatesTags: (result, error, brightData) => {
                    return[{type: 'Brightness', id: 'All'}]
                },
                query: (brightData) => {
                    return {
                        url: '/brightness/create-stone-brightness',
                        method: 'POST',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        url: `/brightness/update-stone-brightness`,
                        method: 'PUT',
                        // headers: {
                        //     "Authorization": token
                        // },
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
            removeBrightness: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Brightness', id:'All'}]
                },
                query: (brightCode) => {
                    return {
                        url: `/brightness/delete-stone-brightness/${brightCode}`,
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



export const { useFetchBrightnessQuery, useFetchTrueBrightnessQuery, useFetchBrightnessByIdQuery, useAddBrightnessMutation, useUpdateBrightnessMutation, useRemoveBrightnessMutation, useFetchBrightnessCountQuery } = brightnessApi;
export { brightnessApi };