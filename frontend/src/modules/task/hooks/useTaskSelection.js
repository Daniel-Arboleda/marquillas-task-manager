import { useCallback, useState } from "react";

export default function useTaskSelection() {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggle = useCallback((id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    }, []);

    const selectAll = useCallback((tasks = []) => {
        setSelectedIds(tasks.map(({ id }) => id));
    }, []);

    const clear = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const isSelected = useCallback((id) => {
        return selectedIds.includes(id);
    }, [selectedIds]);

    return {
        selectedIds,
        toggle,
        selectAll,
        clear,
        isSelected,
    };
}