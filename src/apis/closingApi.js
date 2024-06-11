import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const closingApi = createApi({
    reducerPath: "closing",
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
            fetchCloseDate: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: () => {
                    return {
                        url: `/cash-closing/close-date`,
                        method: 'GET',
                    };
                },
            }),
            fetchOpening: builder.query({
                providesTags: () => {
                    return[{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-opening`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchPurchaseData: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    console.log(filterData);
                    return {
                        url: `/cash-closing/get-purchase?start_date=${filterData.start_date}&end_date=${filterData.end_date}`,
                        method: 'GET',
                    };
                },
            }),
            fetchPurchaseDetails: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-purchase-details`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchSalesData: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-sales`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchSalesDetails: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-sales-details`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchCashInOutData: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-cash-in-out`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchCashInOutDetails: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-cash-in-out-details`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchPayableDetails: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-payable-details`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            fetchReceivableDetails: builder.query({
                providesTags: () => {
                    return [{type: 'Closing', id: 'All'}]
                },
                query: (filterData) => {
                    return {
                        url: `/cash-closing/get-receivable-details`,
                        method: 'GET',
                        params: filterData,
                    };
                },
            }),
            addClosing: builder.mutation({
                query: (data) => {
                    return {
                        url: `/cash-closing/close-transaction`,
                        method: 'POST',
                        body: {
                            balanceAmt: Number(data.balanceAmt),
                            transactionStartDate: data.transactionStartDate,
                            transactionEndDate: data.transactionEndDate,
                            updatedBy : data.updatedBy
                        }
                    }
                }
            }),
        };
    },
});

export const { useFetchCashInOutDetailsQuery, useFetchCashInOutDataQuery, useFetchOpeningQuery, useFetchPurchaseDataQuery, useFetchPurchaseDetailsQuery, useFetchSalesDataQuery, useFetchSalesDetailsQuery, useFetchCloseDateQuery, useFetchPayableDetailsQuery, useFetchReceivableDetailsQuery, useAddClosingMutation } = closingApi;
export { closingApi };