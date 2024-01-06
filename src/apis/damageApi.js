import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const damageApi = createApi({
    reducerPath: "damage",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchDamageId: builder.query({
                query: () => {
                    return {
                        url: "/damage/get-id",
                        method: "GET"
                    }
                }
            }),
            fetchDamage: builder.query({
                providesTags: () => {
                    return[{type: "Damage", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?skip=${filterData.skip}&take=${filterData.take}&status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/damage/get-all-damages" + query,
                        method: "GET",
                    };
                },
            }),
            fetchDamageCount: builder.query({
                providesTags: () => {
                    return[{type: "Damage", id: "All"}]
                },
                query: (filterData) => {
                    const query = `?status=${filterData.status}${filterData.search_word == '' ? '' : `&search_word=${filterData.search_word}`}${filterData.start_date == null ? '' : `&start_date=${filterData.start_date}`}${filterData.end_date == null ? '' : `&end_date=${filterData.end_date}`}`;
                    return {
                        url: "/damage/get-count" + query,
                        method: "GET",
                    };
                },
            }),
            fetchDamageById: builder.query({
                providesTags: () => {
                    return [{type: "Damage", id: "All"}]
                },
                query: (damageId) => {
                    return {
                        url: `/damage/get-damage/${damageId}`,
                        method: "GET",
                    };
                },
            }),
            addDamage: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Damage", id: "All"}]
                },
                query: (damageData) => {
                    return {
                        url: "/damage/create-damage",
                        method: "POST",
                        body: damageData,
                    };
                },
            }),
            updateDamage: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Damage", id: "All"}]
                },
                query: (damageData) => {
                    return {
                        url: "/damage/update-damage",
                        method: "PUT",
                        body: damageData
                    };
                },
            }),
            removeDamage: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "Damage", id: "All"}]
                },
                query: (damageData) => {
                    return {
                        url: "/damage/delete-damage",
                        method: "PUT",
                        body: damageData,
                    };
                },
            }),
        };
    },
});

export const { useFetchDamageIdQuery, useFetchDamageQuery, useFetchDamageByIdQuery, useAddDamageMutation, useUpdateDamageMutation, useRemoveDamageMutation } = damageApi;
export { damageApi };