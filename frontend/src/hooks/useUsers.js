import { useCallback, useEffect, useState } from "react";
import { listUsers } from "../api/userApi";

export default function useUsers(enabled = true) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        if (!enabled) {
            setUsers([]);
            setLoading(false);
            setError(null);
            return [];
        }

        setLoading(true);
        setError(null);

        try {
            const response = await listUsers();
            const items = response?.items ?? response;
            setUsers(Array.isArray(items) ? items : []);
            return items;
        } catch (err) {
            if (err?.response?.status === 403) {
                setUsers([]);
                return [];
            }
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {
        users,
        loading,
        error,
        refresh,
    };
}