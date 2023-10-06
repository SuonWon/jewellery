import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const customerApi = createApi({
    reducerPath: "customer",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchCustomer: builder.query({
                providesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/customer/get-all-customers',
                        method: 'GET',
                    };
                },
            }),
            fetchCustomerById: builder.query({
                query: (customerCode) => {
                    return {
                        url: `/v1/customer/get-customer/${customerCode}`,
                        method: 'GET'
                    };
                },
            }),
            addCustomer: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Customer', id: 'All'}]
                },
                query: (customerData) => {
                    return {
                        url: '/v1/customer/create-customer',
                        method: 'POST',
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
                        url: `/v1/customer/update-customer`,
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
                        url: `/v1/customer/delete-customer/${customerCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchCustomerQuery, useFetchCustomerByIdQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } = customerApi;
export { customerApi };