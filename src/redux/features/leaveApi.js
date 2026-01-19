import { baseApi } from "../api/baseApi";

const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: ({ page, searchTerm }) => {
        return {
          url: `/leave-application`,
          method: "GET",
          params: {
            searchTerm,
            page,
            limit: 10,
          },
        };
      },
    }),
    changeStatus: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/leave-application/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
    }),
  }),
});

export const { useGetLeavesQuery, useChangeStatusMutation } = leaveApi;
