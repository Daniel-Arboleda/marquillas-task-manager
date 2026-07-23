PRINT '==============================';
PRINT 'VALIDACION CONSULTA 1';
PRINT '==============================';
PRINT '';

PRINT '1. Total de tareas';
SELECT COUNT(*) AS total_tasks
FROM tasks;
GO

PRINT '';
PRINT '2. Resultado de la Consulta 1';
SELECT
    t.status,
    t.priority,
    COUNT(*) AS total_tasks,
    CAST(
        ROUND(
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(),
            2
        ) AS DECIMAL(5,2)
    ) AS percentage
FROM tasks AS t
GROUP BY
    t.status,
    t.priority
ORDER BY
    t.status,
    t.priority;
GO

PRINT '';
PRINT '3. Validacion de porcentaje';
WITH summary AS (
    SELECT
        CAST(
            ROUND(
                COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(),
                2
            ) AS DECIMAL(5,2)
        ) AS percentage
    FROM tasks
    GROUP BY
        status,
        priority
)
SELECT
    CASE
        WHEN ABS(SUM(percentage) - 100.00) <= 0.10 THEN 'PASS'
        ELSE 'FAIL'
    END AS validation,
    SUM(percentage) AS total_percentage
FROM summary;
GO

PRINT '';
PRINT 'VALIDACION FINALIZADA';