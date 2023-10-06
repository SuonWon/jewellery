import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const stoneDetailsApi = createApi({
    reducerPath: "stoneDetails",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchStoneDetails: builder.query({
                providesTags: () => {
                    return[{type: 'StoneDetails', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/stone-detail/get-all-stone-details',
                        method: 'GET',
                    };
                },
            }),
            fetchStoneDetailsById: builder.query({
                query: (stoneDetailCode) => {
                    return {
                        url: `/stone-detail/get-stone-detail/${stoneDetailCode}`,
                        method: 'GET'
                    };
                },
            }),
            addStoneDetails: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'StoneDetails', id: 'All'}]
                },
                query: (stoneDetailsData) => {
                    console.log(stoneDetailsData);
                    return {
                        url: '/stone-detail/create-stone-detail',
                        method: 'POST',
                        body: {
                            stoneDesc: stoneDetailsData.stoneDesc,
                            stoneCode: Number(stoneDetailsData.stoneCode),
                            typeCode: Number(stoneDetailsData.typeCode),
                            brightCode: Number(stoneDetailsData.brightCode),
                            gradeCode: Number(stoneDetailsData.gradeCode),
                            size: stoneDetailsData.size,
                            qty: Number(stoneDetailsData.qty),
                            weight: Number(stoneDetailsData.weight),
                            unitCode: stoneDetailsData.unitCode,
                            remark: stoneDetailsData.remark,
                            createdAt: stoneDetailsData.createdAt,
                            createdBy: stoneDetailsData.createdBy,
                            updatedAt: stoneDetailsData.updatedAt,
                            updatedBy: stoneDetailsData.updatedBy,
                        },
                    };
                },
            }),
            updateStoneDetails: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'StoneDetails', id:'All'}]
                },
                query: (stoneDetailsData) => {
                    return {
                        url: `/stone-detail/update-stone-detail`,
                        body: {
                            stoneDetailCode: stoneDetailsData.stoneDetailCode,
                            stoneDesc: stoneDetailsData.stoneDesc,
                            stoneCode: Number(stoneDetailsData.stoneCode),
                            typeCode: Number(stoneDetailsData.typeCode),
                            brightCode: Number(stoneDetailsData.brightCode),
                            gradeCode: Number(stoneDetailsData.gradeCode),
                            size: stoneDetailsData.size,
                            qty: Number(stoneDetailsData.qty),
                            weight: Number(stoneDetailsData.weight),
                            unitCode: stoneDetailsData.unitCode,
                            remark: stoneDetailsData.remark,
                            createdAt: stoneDetailsData.createdAt,
                            createdBy: stoneDetailsData.createdBy,
                            updatedAt: stoneDetailsData.updatedAt,
                            updatedBy: stoneDetailsData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeStoneDetails: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'StoneDetails', id:'All'}]
                },
                query: (stoneDetailCode) => {
                    console.log(stoneDetailCode);
                    return {
                        url: `/stone-detail/delete-stone-detail/${stoneDetailCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchStoneDetailsQuery, useFetchStoneDetailsByIdQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation } = stoneDetailsApi;
export { stoneDetailsApi };