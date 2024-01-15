import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

const token = 'Bearer ' + Cookies.get('_auth');

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
                        method: "GET",
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
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
                        headers: {
                            "Authorization": token
                        },
                        body: damageData,
                    };
                },
            }),
        };
    },
});

export const { useFetchDamageIdQuery, useFetchDamageQuery, useFetchDamageByIdQuery, useAddDamageMutation, useUpdateDamageMutation, useRemoveDamageMutation } = damageApi;
export { damageApi };