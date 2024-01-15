import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

const shareApi = createApi({
    reducerPath: "share",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchShare: builder.query({
                providesTags: () => {
                    return [{type: "Share", id: "All"}]
                },
                query: (filterData) => {
                    return {
                        url: "/share/get-all-shares",
                        method: "GET",
                        headers: {
                            "Authorization": token
                        },
                        params: filterData
                    };
                },
            }),
            fetchShareCount: builder.query({
                providesTags: () => {
                    return[{type: 'Share', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url:`/share/get-count`,
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                        params: data
                    };
                },
            }),
            fetchTrueShare: builder.query({
                providesTags: () => {
                    return [{type: "Share", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/share/get-true-shares",
                        method: "GET",
                        headers: {
                            "Authorization": token
                        }
                    }
                }
            }),
            fetchShareById: builder.query({
                providesTags: () => {
                    return [{type: "Share", id:"All"}]
                },
                query: (shareId) => {
                    console.log(shareId);
                    return {
                        url: `/share/get-share/${shareId}`,
                        method: "GET",
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
            addShare: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Share", id: "All"}]
                },
                query: (shareData) => {
                    return {
                        url: "/share/create-share",
                        method: "POST",
                        headers: {
                            "Authorization": token
                        },
                        body: shareData,
                    };
                },
            }),
            updateShare: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Share", id: "All"}]
                },
                query: (shareData) => {
                    return {
                        url: "/share/update-share",
                        method: "PUT",
                        headers: {
                            "Authorization": token
                        },
                        body: shareData,
                    };
                },
            }),
            removeShare: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Share", id:"All"}]
                },
                query: (shareId) => {
                    return {
                        url: `/share/delete-share/${shareId}`,
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

export const { useFetchShareQuery, useFetchShareByIdQuery, useFetchTrueShareQuery, useAddShareMutation, useUpdateShareMutation, useRemoveShareMutation, useFetchShareCountQuery } = shareApi
export { shareApi };