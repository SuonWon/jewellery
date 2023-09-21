import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const gradeApi = createApi({
    reducerPath: "grade",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3005/",
    }),
    endpoints(builder) {
        return {
            fetchGrade: builder.query({
                providesTags: (result, error) => {
                    return[{type: 'Grade', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/grade/get-all-stone-grades',
                        method: 'GET',
                    };
                },
            }),
            fetchGradeById: builder.query({
                query: (gradeCode) => {
                    return {
                        url: `/v1/grade/get-stone-grade/${gradeCode}`,
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
                        url: '/v1/grade/create-stone-grade',
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
                        url: `/v1/grade/update-stone-grade`,
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
                        url: `/v1/grade/delete-stone-grade/${gradeCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchGradeQuery, useFetchGradeByIdQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation } = gradeApi;
export { gradeApi };