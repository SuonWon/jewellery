import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

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
                        method: "GET"
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
                    };
                }, 
            })
        };
    },
});

export const { useFetchShareQuery, useFetchShareByIdQuery, useFetchTrueShareQuery, useAddShareMutation, useUpdateShareMutation, useRemoveShareMutation, useFetchShareCountQuery } = shareApi
export { shareApi };