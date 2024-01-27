import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const authApi = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            addCompany: builder.mutation({
                query: (companyData) => {
                    return {
                        url: "/auth/create-company-info",
                        method: "POST",
                        body: companyData
                    };
                },
            }),
            addDefaultUser: builder.mutation({
                query: (userData) => {
                    return {
                        url: "/auth/create-system-user",
                        method: "POST",
                        body: userData
                    };
                },
            }),
            addDefaultRole: builder.mutation({
                query: (roleData) => {
                    return {
                        url: "/auth/create-system-role",
                        method: "POST",
                        body: roleData
                    };
                },
            }),
            addDefaultCategory: builder.mutation({
                query: (categoryData) => {
                    return {
                        url: "/auth/create-wallet-category",
                        method: "POST",
                        body: categoryData
                    };
                },
            }),
            addDefaultShare: builder.mutation({
                query: (supplierData) => {
                    return {
                        url: "/auth/create-share",
                        method: "POST",
                        body: supplierData
                    }
                } 
            }),
            checkUser: builder.query({
                query: () => {
                    return {
                        url: "/auth/check-user",
                        method: "GET",
                    }
                }
            }),
        };
    },
});

export const { useAddCompanyMutation, useAddDefaultRoleMutation, useAddDefaultUserMutation, useAddDefaultCategoryMutation, useCheckUserQuery, useAddDefaultShareMutation } = authApi;
export { authApi };