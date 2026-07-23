import { useCallback, useState } from "react";
import {
    DEFAULT_PAGINATION,
    DEFAULT_TASK_FILTERS,
} from "../services/taskDefaults";

const INITIAL_FILTERS = {
    ...DEFAULT_TASK_FILTERS,
    ...DEFAULT_PAGINATION,
};

export default function useTaskFilters() {
    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const setSearch = useCallback((search) => {
        setFilters((current) => ({
            ...current,
            search,
            page: 1,
        }));
    }, []);

    const setStatus = useCallback((status) => {
        setFilters((current) => ({
            ...current,
            status,
            page: 1,
        }));
    }, []);

    const setPriority = useCallback((priority) => {
        setFilters((current) => ({
            ...current,
            priority,
            page: 1,
        }));
    }, []);

    const setAssignedUser = useCallback((assignedUserId) => {
        setFilters((current) => ({
            ...current,
            assignedUserId,
            page: 1,
        }));
    }, []);

    const setPage = useCallback((page) => {
        setFilters((current) => ({
            ...current,
            page,
        }));
    }, []);

    const setPageSize = useCallback((pageSize) => {
        setFilters((current) => ({
            ...current,
            pageSize,
            page: 1,
        }));
    }, []);

    const clear = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    return {
        filters,
        setSearch,
        setStatus,
        setPriority,
        setAssignedUser,
        setPage,
        setPageSize,
        clear,
    };
}