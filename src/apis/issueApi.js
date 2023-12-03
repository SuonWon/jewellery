import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const issueApi = createApi({
    reducerPath: "issue",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchIssue: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/issue/get-all-issue",
                        method: "GET",
                    };
                },
            }),
            fetchTrueIssue: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: () => {
                    return {
                        url: `/issue/get-all-issue`,
                        method: "GET",
                        params: {status: "O"}
                    }
                }
            }),
            fetchIssueById: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueId) => {
                    return {
                        url: `/issue/get-issue/${issueId}`,
                        method: "GET",
                    };
                },
            }),
            addIssue: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueData) => {
                    return {
                        url: "/issue/create-issue",
                        method: "POST",
                        body: issueData,
                    };
                },
            }),
            updateIssue: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueData) => {
                    console.log(issueData);
                    return {
                        url: "/issue/update-issue",
                        method: "PUT",
                        body: issueData,
                    };
                },
            }),
            updateIssueStatus: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueData) => {
                    return {
                        url: "/issue/update-issue-finish",
                        method: "PUT",
                        body: issueData,
                    };
                },
            }),
            removeIssue: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueData) => {
                    return {
                        url: "/issue/delete-issue",
                        method: "PUT",
                        body: issueData,
                    };
                }
            }),
        };
    },
});

export const { useFetchIssueQuery, useFetchIssueByIdQuery, useFetchTrueIssueQuery, useAddIssueMutation, useUpdateIssueMutation, useUpdateIssueStatusMutation, useRemoveIssueMutation } = issueApi;
export { issueApi }