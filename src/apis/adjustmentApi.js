import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../const";

const adjustmentApi = createApi({
    reducerPath: "adjustment",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
    }),
    endpoints(builder) {
        return {
            fetchAdjustment: builder.query({
                providesTags: () => {
                    return [{type: "Adjustment", id: "All"}]
                },
                query: () => {
                    return {
                        url: "/adjustment/get-all-adjustments",
                        method: "GET"
                    };
                },
            }),
        };
    },
});