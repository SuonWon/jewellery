import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const systemUserApi = createApi({
    reducerPath: "systemUser",
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
            fetchUsersCount: builder.query({
                providesTags: () => {
                    return [{type: "SystemUser", id: "All"}];
                },
                query: (filterData) => {
                    return {
                        url: "/system-user/get-count",
                        method: "GET",
                        params: filterData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchUsers: builder.query({
                providesTags: () => {
                    return [{type: "SystemUser", id: "All"}];
                },
                query: (filterData) => {
                    return {
                        url: "/system-user/get-all-system-users",
                        method: "GET",
                        params: filterData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchTrueUsers: builder.query({
                providesTags: () => {
                    return [{type: "SystemUser", id: "All"}];
                },
                query: () => {
                    return {
                        url: "/system-user/get-true-system-users",
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchUserById: builder.query({
                providesTags: () => {
                    return [{type: "SystemUser", id: "All"}];
                },
                query: (username) => {
                    return {
                        url: `/system-user/get-system-user/${username}`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            fetchUserRole: builder.query({
                query: (username) => {
                    return {
                        url: `/system-user/get-user-role/${username}`,
                        method: "GET",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            addUser: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "SystemUser", id: "All"}]
                },
                query: (userData) => {
                    return {
                        url: "/system-user/create-system-user",
                        method: "POST",
                        body: userData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            updateUser: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "SystemUser", id: "All"}]
                },
                query: (userData) => {
                    return {
                        url: "/system-user/update-system-user",
                        method: "PUT",
                        body: userData,
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
            removeUser: builder.mutation({
                invalidatesTags: () => {
                    return [{type: "SystemUser", id: "All"}]
                },
                query: (username) => {
                    return {
                        url: `/system-user/delete-system-user/${username}`,
                        method: "DELETE",
                        // headers: {
                        //     "Authorization": token
                        // }
                    };
                },
            }),
        };
    },
});

export const { useFetchTrueUsersQuery, useFetchUserByIdQuery, useFetchUserRoleQuery, useFetchUsersCountQuery, useFetchUsersQuery, useAddUserMutation, useUpdateUserMutation, useRemoveUserMutation } = systemUserApi;
export { systemUserApi };