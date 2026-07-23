PRINT '==============================';
PRINT 'VALIDACION CONSULTA 2';
PRINT '==============================';
PRINT '';

PRINT '1. Totales de referencia';
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM tasks WHERE assigned_user_id IS NOT NULL) AS assigned_tasks,
    (SELECT COUNT(*) FROM tasks WHERE assigned_user_id IS NOT NULL AND status='completed') AS completed_tasks;
GO

PRINT '';
PRINT '2. Resultado de la Consulta 2';
SELECT
    u.id AS user_id,
    u.name AS user_name,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.status='completed' THEN 1 ELSE 0 END) AS completed_tasks,
    RANK() OVER(
        ORDER BY SUM(CASE WHEN t.status='completed' THEN 1 ELSE 0 END) DESC
    ) AS completed_rank
FROM users AS u
LEFT JOIN tasks AS t
    ON t.assigned_user_id=u.id
GROUP BY
    u.id,
    u.name
ORDER BY
    completed_rank,
    u.id;
GO

PRINT '';
PRINT '3. Validacion del ranking';
WITH user_ranking AS (
    SELECT
        u.id AS user_id,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status='completed' THEN 1 ELSE 0 END) AS completed_tasks,
        RANK() OVER(
            ORDER BY SUM(CASE WHEN t.status='completed' THEN 1 ELSE 0 END) DESC
        ) AS completed_rank
    FROM users AS u
    LEFT JOIN tasks AS t
        ON t.assigned_user_id=u.id
    GROUP BY
        u.id
)
SELECT
    CASE
        WHEN COUNT(*)=(SELECT COUNT(*) FROM users)
         AND SUM(total_tasks)=(SELECT COUNT(*) FROM tasks WHERE assigned_user_id IS NOT NULL)
         AND SUM(completed_tasks)=(
             SELECT COUNT(*)
             FROM tasks
             WHERE assigned_user_id IS NOT NULL
               AND status='completed'
         )
         AND MIN(completed_rank)=1
        THEN 'PASS'
        ELSE 'FAIL'
    END AS validation,
    COUNT(*) AS evaluated_users,
    SUM(total_tasks) AS assigned_tasks,
    SUM(completed_tasks) AS completed_tasks,
    MAX(completed_rank) AS max_rank
FROM user_ranking;
GO

PRINT '';
PRINT 'VALIDACION FINALIZADA';