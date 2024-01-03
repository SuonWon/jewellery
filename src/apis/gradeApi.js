import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


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
                        method: 'GET'
                    }
                }
            }),
            fetchGradeById: builder.query({
                query: (gradeCode) => {
                    return {
                        url: `/grade/get-stone-grade/${gradeCode}`,
                        method: 'GET'
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
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchGradeQuery, useFetchTrueGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation, useFetchGradeCountQuery } = gradeApi;
export { gradeApi };