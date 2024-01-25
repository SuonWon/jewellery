import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

//const token = 'Bearer ' + Cookies.get('_auth');

const supplierApi = createApi({
    reducerPath: "supplier",
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
            fetchSupplier: builder.query({
                providesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url:'/supplier/get-all-suppliers',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: filterData
                    };
                },
            }),
            fetchSupplierCount: builder.query({
                providesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: (filterData) => {
                    const data = {
                        search: filterData.search
                    }
                    return {
                        url:`/supplier/get-count`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                        params: data
                    };
                },
            }),
            fetchSupplierById: builder.query({
                providesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: (supplierCode) => {
                    return {
                        url: `/supplier/get-supplier/${supplierCode}`,
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            fetchTrueSupplier: builder.query({
                providesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: () => {
                    return {
                        url: '/supplier/get-true-suppliers',
                        method: 'GET',
                        // headers: {
                        //     "Authorization": token
                        // },
                    };
                },
            }),
            addSupplier: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: (supplierData) => {
                    return {
                        url: '/supplier/create-supplier',
                        method: 'POST',
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: {
                            supplierName: supplierData.supplierName,
                            contactName: supplierData.contactName,
                            contactNo: supplierData.contactNo,
                            officeNo: supplierData.officeNo,
                            street: supplierData.street,
                            township: supplierData.township,
                            city: supplierData.city,
                            region: supplierData.region,
                            isActive: supplierData.isActive,
                            remark: supplierData.remark,
                            createdAt: supplierData.createdAt,
                            createdBy: supplierData.createdBy,
                            updatedAt: supplierData.updatedAt,
                            updatedBy: supplierData.updatedBy,
                        },
                    };
                },
            }),
            updateSupplier: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Supplier', id:'All'}]
                },
                query: (supplierData) => {
                    return {
                        url: `/supplier/update-supplier`,
                        // headers: {
                        //     "Authorization": token
                        // },
                        body: {
                            supplierCode: supplierData.supplierCode,
                            supplierName: supplierData.supplierName,
                            contactName: supplierData.contactName,
                            contactNo: supplierData.contactNo,
                            officeNo: supplierData.officeNo,
                            street: supplierData.street,
                            township: supplierData.township,
                            city: supplierData.city,
                            region: supplierData.region,
                            isActive: supplierData.isActive,
                            remark: supplierData.remark,
                            createdAt: supplierData.createdAt,
                            createdBy: supplierData.createdBy,
                            updatedAt: supplierData.updatedAt,
                            updatedBy: supplierData.updatedBy,
                        },
                        method: 'PUT',
                    };
                },
            }),
            removeSupplier: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Supplier', id:'All'}]
                },
                query: (supplierCode) => {
                    return {
                        url: `/supplier/delete-supplier/${supplierCode}`,
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

export const { useFetchSupplierQuery, useFetchTrueSupplierQuery, useFetchSupplierByIdQuery, useAddSupplierMutation, useUpdateSupplierMutation, useRemoveSupplierMutation, useFetchSupplierCountQuery } = supplierApi;
export { supplierApi };