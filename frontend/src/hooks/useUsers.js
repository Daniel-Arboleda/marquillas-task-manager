import { useCallback, useEffect, useState } from "react";
import { listUsers } from "../api/userApi";

export default function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listUsers();
            setUsers(response.items ?? response);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        users,
        loading,
        error,
        refresh,
    };
}