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
                query: (filterData) => {
                    return {
                        url:'/stone-detail/get-all-stone-details',
                        method: 'GET',
                        params: filterData
                    };
                },
            }),
            fetchStoneDetailsCount: builder.query({
                providesTags: () => {
                    return[{type: 'StoneDetails', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url: '/stone-detail/get-count',
                        method: 'GET',
                        params: data
                    };
                },
            }),
            fetchActiveStoneDetails: builder.query({
                providesTags: () => {
                    return[{type: 'StoneDetails', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/stone-detail/get-active-stone-details',
                        method: 'GET'
                    };
                },
            }),
            fetchPurchaseShare: builder.query({
                query: () => {
                    return {
                        url: "/stone-detail/get-purchase-share/{purchaseId}",
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
                        body: stoneDetailsData,
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
                        body: stoneDetailsData,
                        method: 'PUT',
                    };
                },
            }),
            removeStoneDetails: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'StoneDetails', id:'All'}]
                },
                query: (stoneDetailCode) => {
                    return {
                        url: `/stone-detail/delete-stone-detail/${stoneDetailCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchStoneDetailsQuery, useFetchStoneDetailsByIdQuery, useFetchPurchaseShareQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchStoneDetailsCountQuery, useFetchActiveStoneDetailsQuery } = stoneDetailsApi;
export { stoneDetailsApi };