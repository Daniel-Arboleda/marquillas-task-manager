PRINT '==============================';
PRINT 'VALIDACION CONSULTA 3';
PRINT '==============================';
PRINT '';

IF OBJECT_ID('tempdb..#validation_context') IS NOT NULL
    DROP TABLE #validation_context;

CREATE TABLE #validation_context(
    admin_id INT NOT NULL,
    task_id INT NOT NULL,
    current_user_id INT NOT NULL,
    new_user_id INT NOT NULL
);

DECLARE @admin_id INT;
DECLARE @task_id INT;
DECLARE @current_user_id INT;
DECLARE @new_user_id INT;

SELECT TOP (1)
    @admin_id=id
FROM users
WHERE role='admin'
  AND is_active=1
ORDER BY id;

SELECT TOP (1)
    @task_id=id,
    @current_user_id=assigned_user_id
FROM tasks
WHERE assigned_user_id IS NOT NULL
ORDER BY id;

SELECT TOP (1)
    @new_user_id=id
FROM users
WHERE id<>@current_user_id
  AND is_active=1
ORDER BY id;

INSERT INTO #validation_context(
    admin_id,
    task_id,
    current_user_id,
    new_user_id
)
VALUES(
    @admin_id,
    @task_id,
    @current_user_id,
    @new_user_id
);

PRINT '1. Estado inicial';

SELECT
    u.id,
    u.name,
    u.role
FROM users AS u
WHERE u.id=@admin_id;

SELECT
    u.id,
    u.name
FROM users AS u
WHERE u.id=@current_user_id;

SELECT
    u.id,
    u.name
FROM users AS u
WHERE u.id=@new_user_id;

SELECT
    t.id,
    t.title,
    t.assigned_user_id
FROM tasks AS t
WHERE t.id=@task_id;
GO

DECLARE @admin_id INT;
DECLARE @task_id INT;
DECLARE @new_user_id INT;

SELECT
    @admin_id=admin_id,
    @task_id=task_id,
    @new_user_id=new_user_id
FROM #validation_context;

PRINT '';
PRINT '2. Ejecucion del procedimiento';

EXEC sp_reasignar_tarea
    @tarea_id=@task_id,
    @nuevo_asignado=@new_user_id,
    @admin_id=@admin_id;
GO

DECLARE @task_id INT;

SELECT
    @task_id=task_id
FROM #validation_context;

PRINT '';
PRINT '3. Estado posterior';

SELECT
    t.id AS task_id,
    t.assigned_user_id,
    u.name AS assigned_user_name
FROM tasks AS t
INNER JOIN users AS u
    ON u.id=t.assigned_user_id
WHERE t.id=@task_id;

SELECT TOP (1)
    th.task_id,
    th.action,
    th.performed_by,
    th.created_at
FROM task_history AS th
WHERE th.task_id=@task_id
ORDER BY th.created_at DESC;
GO

DECLARE @admin_id INT;
DECLARE @task_id INT;
DECLARE @new_user_id INT;

SELECT
    @admin_id=admin_id,
    @task_id=task_id,
    @new_user_id=new_user_id
FROM #validation_context;

PRINT '';
PRINT '4. Validacion';

SELECT
    CASE
        WHEN EXISTS(
            SELECT 1
            FROM users
            WHERE id=@admin_id
              AND role='admin'
        )
        AND EXISTS(
            SELECT 1
            FROM tasks
            WHERE id=@task_id
              AND assigned_user_id=@new_user_id
        )
        AND EXISTS(
            SELECT 1
            FROM task_history
            WHERE task_id=@task_id
              AND performed_by=@admin_id
        )
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validation,
    CASE
        WHEN EXISTS(
            SELECT 1
            FROM users
            WHERE id=@admin_id
              AND role='admin'
        )
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validated_admin,
    CASE
        WHEN EXISTS(
            SELECT 1
            FROM tasks
            WHERE id=@task_id
        )
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validated_task,
    CASE
        WHEN EXISTS(
            SELECT 1
            FROM tasks
            WHERE id=@task_id
              AND assigned_user_id=@new_user_id
        )
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validated_assignment,
    CASE
        WHEN EXISTS(
            SELECT 1
            FROM task_history
            WHERE task_id=@task_id
              AND performed_by=@admin_id
        )
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validated_history;

DROP TABLE #validation_context;
GO

PRINT '';
PRINT 'VALIDACION FINALIZADA';