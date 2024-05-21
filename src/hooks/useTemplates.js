// A hook to retrieve information about total number of templates present in the firebase store

import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTemplates } from "../api";

const useTemplates = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "templates",
        async () => {
            try {
                const templates = await getTemplates();
                return templates;
            } catch (error) {
                console.log(error);
                toast.error(`Error: ${error.message}`);
            }
        },
        { refetchOnWindowFocus: false }
    );

    return {
        data,
        isError,
        isLoading,
        refetch,
    };
};

export default useTemplates;
