import { useMemo } from "react";
import useAuth from "./useAuth";

const DEFAULT_PERMISSIONS = Object.freeze({
    view: false,
    create: false,
    edit: false,
    delete: false,
    assign: false,
    complete: false,
    reopen: false,
    archive: false,
    duplicate: false,
    export: false,
    aiEnrich: false,
});

const ROLE_PERMISSIONS = Object.freeze({
    admin: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        assign: true,
        complete: true,
        reopen: true,
        archive: true,
        duplicate: true,
        export: true,
        aiEnrich: true,
    },
    member: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        assign: false,
        complete: true,
        reopen: false,
        archive: false,
        duplicate: false,
        export: false,
        aiEnrich: false,
    },
});

export default function usePermissions(resource, entity = null) {
    const auth = useAuth();

    return useMemo(() => {
        const role = auth?.user?.role ?? auth?.role;
        const rolePermissions = ROLE_PERMISSIONS[role];

        if (!resource) {
            return DEFAULT_PERMISSIONS;
        }

        if (Array.isArray(auth?.permissions)) {
            const permissions = { ...DEFAULT_PERMISSIONS };

            Object.keys(DEFAULT_PERMISSIONS).forEach((action) => {
                permissions[action] = auth.permissions.includes(
                    `${resource}.${action}`,
                );
            });

            return permissions;
        }

        if (rolePermissions) {
            return {
                ...DEFAULT_PERMISSIONS,
                ...rolePermissions,
            };
        }

        return DEFAULT_PERMISSIONS;
    }, [
        auth?.permissions,
        auth?.role,
        auth?.user?.role,
        entity,
        resource,
    ]);
}