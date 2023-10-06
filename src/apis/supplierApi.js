import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";


const supplierApi = createApi({
    reducerPath: "supplier",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchSupplier: builder.query({
                providesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: () => {
                    return {
                        url:'/v1/supplier/get-all-suppliers',
                        method: 'GET',
                    };
                },
            }),
            fetchSupplierById: builder.query({
                query: (supplierCode) => {
                    return {
                        url: `/v1/supplier/get-supplier/${supplierCode}`,
                        method: 'GET'
                    };
                },
            }),
            addSupplier: builder.mutation({
                invalidatesTags: () => {
                    return[{type: 'Supplier', id: 'All'}]
                },
                query: (supplierData) => {
                    return {
                        url: '/v1/supplier/create-supplier',
                        method: 'POST',
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
                        url: `/v1/supplier/update-supplier`,
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
                        url: `/v1/supplier/delete-supplier/${supplierCode}`,
                        method: 'DELETE'
                    };
                },
            }),
        }
    }
});

export const { useFetchSupplierQuery, useFetchSupplierByIdQuery, useAddSupplierMutation, useUpdateSupplierMutation, useRemoveSupplierMutation } = supplierApi;
export { supplierApi };