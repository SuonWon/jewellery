import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";
import Cookies from "js-cookie";

//const token = 'Bearer ' + Cookies.get('_auth');

const systemRoleApi = createApi({
    reducerPath: "systemRole",
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
            fetchRolesCount: builder.query({
                providesTags: () => {
                    return [{type: "SystemRole", id: "All"}];
                },
                query: (filterData) => {
                    return {
                        url: "/system-role/get-count",
                        method: "GET",
                        params: filterData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchRoles: builder.query({
                providesTags: () => {
                    return [{type: "SystemRole", id: "All"}];
                },
                query: (filterData) => {
                    return {
                        url: "/system-role/get-all-system-roles",
                        method: "GET",
                        params: filterData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchRoleById: builder.query({
                providesTags: () => {
                    return [{type: "SystemRole", id: "All"}];
                },
                query: (id) => {
                    return {
                        url: `/system-role/get-system-role/${id}`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            addRole: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "SystemRole", id: "All"}];
                },
                query: (roleData) => {
                    return {
                        url: "/system-role/create-system-role",
                        method: "POST",
                        body: roleData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            updateRole: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "SystemRole", id: "All"}];
                },
                query: (roleData) => {
                    return {
                        url: "/system-role/update-system-role",
                        method: "PUT",
                        body: roleData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
        };
    },
});

export const { useFetchRoleByIdQuery, useFetchRolesCountQuery, useFetchRolesQuery, useAddRoleMutation, useUpdateRoleMutation } = systemRoleApi;
export { systemRoleApi };