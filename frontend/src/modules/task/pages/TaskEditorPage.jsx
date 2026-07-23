import { useCallback, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import useUsers from "../../../hooks/useUsers";
import useTask from "../hooks/useTask";
import useTaskCrud from "../hooks/useTaskCrud";
import useTaskDrawer from "../hooks/useTaskDrawer";
import useTaskForm from "../hooks/useTaskForm";
import TaskEditorView from "../views/TaskEditorView";

export default function TaskEditorPage({ mode }) {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const loadedTaskId = useRef(null);
    const drawerState = useTaskDrawer();
    const taskApi = useTask();
    const crud = useTaskCrud();
    const {
        users,
        loading: usersLoading,
    } = useUsers();

    const close = useCallback(() => {
        navigate("/app/tasks");
    }, [navigate]);

    const drawer = useMemo(() => ({
        mode,
        task: drawerState.task,
        setTask: drawerState.setTask,
        close,
    }), [
        mode,
        drawerState.task,
        drawerState.setTask,
        close,
    ]);

    const form = useTaskForm({
        drawer,
        crud,
    });

    useEffect(() => {
        if (
            mode !== "edit"
            || !taskId
            || loadedTaskId.current === taskId
        ) {
            return;
        }

        let mounted = true;

        const loadTask = async () => {
            const task = await taskApi.find(taskId);

            if (!mounted) {
                return;
            }

            loadedTaskId.current = taskId;
            drawerState.setTask(task);
        };

        void loadTask();

        return () => {
            mounted = false;
        };
    }, [
        mode,
        taskId,
        drawerState.setTask,
    ]);

    const assignmentOptions = useMemo(
        () => users.map((user) => ({
            id: user.id,
            name: user.name,
        })),
        [users],
    );

    return (
        <TaskEditorView
            mode={mode}
            task={form.task}
            errors={form.errors}
            submitting={form.submitting}
            users={assignmentOptions}
            usersLoading={usersLoading}
            onChange={form.onChange}
            onSubmit={form.onSubmit}
            onCancel={close}
        />
    );
}

TaskEditorPage.propTypes = {
    mode: PropTypes.oneOf([
        "create",
        "edit",
    ]).isRequired,
};