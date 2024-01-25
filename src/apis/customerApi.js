import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const customerApi = createApi({
    reducerPath: "customer",
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
            fetchCustomer: builder.query({
                providesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:`/customer/get-all-customers`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: filterData
                    };
                },
            }),
            fetchCustomerCount: builder.query({
                providesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url:`/customer/get-count`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: data
                    };
                },
            }),
            fetchCustomerById: builder.query({
                providesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: (customerCode) => {
                    return {
                        url: `/customer/get-customer/${customerCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchTrueCustomer: builder.query({
                providesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: () => {
                    return {
                        url: `/customer/get-true-customers`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            addCustomer: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: (customerData) => {
                    return {
                        url: '/customer/create-customer',
                        method: 'POST',
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: {
                            customerName: customerData.customerName,
                            nrcNo: customerData.nrcNo,
                            companyName: customerData.companyName,
                            contactNo: customerData.contactNo,
                            officeNo: customerData.officeNo,
                            street: customerData.street,
                            township: customerData.township,
                            city: customerData.city,
                            region: customerData.region,
                            isActive: customerData.isActive,
                            remark: customerData.remark,
                            createdAt: customerData.createdAt,
                            createdBy: customerData.createdBy,
                            updatedAt: customerData.updatedAt,
                            updatedBy: customerData.updatedBy,
                        },
                    };
                },
            }),
            updateCustomer: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Customer', id:'All'}]
                },
                query: (customerData) => {
                    return {
                        url: `/customer/update-customer`,
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: {
                            customerCode: customerData.customerCode,
                            customerName: customerData.customerName,
                            nrcNo: customerData.nrcNo,
                            companyName: customerData.companyName,
                            contactNo: customerData.contactNo,
                            officeNo: customerData.officeNo,
                            street: customerData.street,
                            township: customerData.township,
                            city: customerData.city,
                            region: customerData.region,
                            isActive: customerData.isActive,
                            remark: customerData.remark,
                            createdAt: customerData.createdAt,
                            createdBy: customerData.createdBy,
                            updatedAt: customerData.updatedAt,
                            updatedBy: customerData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeCustomer: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Customer', id:'All'}]
                },
                query: (customerCode) => {
                    return {
                        url: `/customer/delete-customer/${customerCode}`,
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

export const { useFetchCustomerQuery, useFetchTrueCustomerQuery, useFetchCustomerByIdQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation, useFetchCustomerCountQuery } = customerApi;
export { customerApi };