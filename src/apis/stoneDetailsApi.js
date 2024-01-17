import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const stoneDetailsApi = createApi({
    reducerPath: "stoneDetails",
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
            fetchStoneDetails: builder.query({
                providesTags: () => {
                    return[{type: 'StoneDetails', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/stone-detail/get-all-stone-details',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchPurchaseShare: builder.query({
                query: () => {
                    return {
                        url: "/stone-detail/get-purchase-share/{purchaseId}",
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchStoneDetailsById: builder.query({
                query: (stoneDetailCode) => {
                    return {
                        url: `/stone-detail/get-stone-detail/${stoneDetailCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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
                        // headers: {
                        //     "Authorization": token
                        // },
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

export const { useFetchStoneDetailsQuery, useFetchStoneDetailsByIdQuery, useFetchPurchaseShareQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchStoneDetailsCountQuery, useFetchActiveStoneDetailsQuery } = stoneDetailsApi;
export { stoneDetailsApi };