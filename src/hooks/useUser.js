/** This hook is to get the user information */

import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetail } from "../api";

const useUser = () => {
    const { isLoading, isError, data, refetch } = useQuery(
        //* Identifier for the query
        "user",

        //* Asynchronous callback function to fetch user details
        async () => {
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (error) {
                //* If the error message does not include "not authenticated" and display toast message if not authentication error
                if (!error.message.includes("not authenticated")) {
                    toast.error("Something went wrong!");
                }
            }
        },

        //* Disable automatic data refetching when the window regains focus
        //* This gives more control over when data is fetched and avoids unnecessary refetching
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, isError, refetch };
};

export default useUser;
