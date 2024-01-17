import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const issueApi = createApi({
    reducerPath: "issue",
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
            fetchIssue: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}&isComplete=${filterData.isComplete}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/issue/get-all-issue" + query,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchTrueIssue: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: () => {
                    return {
                        url: `/issue/get-true-issue`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                    }
                }
            }),
            fetchIssueCount: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=${filterData.status}&isComplete=${filterData.isComplete}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/issue/get-count" + query,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchIssueById: builder.query({
                providesTags: () => {
                    return [{type: "Issue", id: "All"}]
                },
                query: (issueId) => {
                    return {
                        url: `/issue/get-issue/${issueId}`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: issueData,
                    };
                }
            }),
        };
    },
});

export const { useFetchIssueQuery, useFetchIssueByIdQuery, useFetchTrueIssueQuery, useAddIssueMutation, useUpdateIssueMutation, useUpdateIssueStatusMutation, useRemoveIssueMutation, useFetchIssueCountQuery } = issueApi;
export { issueApi }