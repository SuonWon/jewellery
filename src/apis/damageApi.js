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
                query: () => {
                    return {
                        url: "/damage/get-all-damages",
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