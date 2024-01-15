import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

const gradeApi = createApi({
    reducerPath: "grade",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchGrade: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Grade', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/grade/get-all-stone-grades',
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                        params: filterData
                    };
                },
            }),
            fetchGradeCount: builder.query({
                providesTags: () => {
                    return[{type: 'Grade', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/grade/get-count',
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                        params: data
                    };
                },
            }),
            fetchTrueGrade: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Grade', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/grade/get-true-stone-grades',
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                    }
                }
            }),
            fetchGradeById: builder.query({
                query: (gradeCode) => {
                    return {
                        url: `/grade/get-stone-grade/${gradeCode}`,
                        method: 'GET',
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
            addGrade: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Grade', id: 'All'}]
                },
                query: (gradeData) => {
                    return {
                        url: '/grade/create-stone-grade',
                        method: 'POST',
                        headers: {
                            "Authorization": token
                        },
                        body: {
                            gradeCode: gradeData.gradeCode,
                            gradeDesc: gradeData.gradeDesc,
                            status: gradeData.status,
                            createdAt: gradeData.createdAt,
                            createdBy: gradeData.createdBy,
                            updatedAt: gradeData.updatedAt,
                            updatedBy: gradeData.updatedBy,
                        },
                    };
                },
            }),
            updateGrade: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Grade', id:'All'}]
                },
                query: (gradeData) => {
                    return {
                        url: `/grade/update-stone-grade`,
                        headers: {
                            "Authorization": token
                        },
                        body: {
                            gradeCode: gradeData.gradeCode,
                            gradeDesc: gradeData.gradeDesc,
                            status: gradeData.status,
                            createdAt: gradeData.createdAt,
                            createdBy: gradeData.createdBy,
                            updatedAt: gradeData.updatedAt,
                            updatedBy: gradeData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeGrade: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Grade', id:'All'}]
                },
                query: (gradeCode) => {
                    return {
                        url: `/grade/delete-stone-grade/${gradeCode}`,
                        method: 'DELETE',
                        headers: {
                            "Authorization": token
                        },
                    };
                },
            }),
        }
    }
});

export const { useFetchGradeQuery, useFetchTrueGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation, useFetchGradeCountQuery } = gradeApi;
export { gradeApi };