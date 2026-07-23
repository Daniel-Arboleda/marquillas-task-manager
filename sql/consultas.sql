/*
==============================================================================
Marquillas Task Manager
Technical Assessment
SQL Server Queries
==============================================================================
*/

/*
==============================================================================
Consulta 1
Reporte por estado y prioridad

Devuelve el número de tareas por estado y prioridad junto con el porcentaje
que representa cada combinación respecto al total de tareas.
==============================================================================
*/
SELECT
    t.status,
    t.priority,
    COUNT(*) AS total_tasks,
    CAST(
        ROUND(
            COUNT(*)*100.0/SUM(COUNT(*)) OVER(),
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

/*
==============================================================================
Consulta 2
Ranking de tareas completadas por usuario

Devuelve para cada usuario el total de tareas asignadas, la cantidad de tareas
completadas y su posición en el ranking de tareas completadas.
==============================================================================
*/
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

/*
==============================================================================
Consulta 3
Stored Procedure de reasignación de tareas

Reasigna una tarea validando permisos administrativos, ejecutando la operación
dentro de una transacción y registrando el cambio en el historial.
==============================================================================
*/
GO

CREATE OR ALTER PROCEDURE sp_reasignar_tarea
    @tarea_id INT,
    @nuevo_asignado INT,
    @admin_id INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (
            SELECT 1
            FROM users
            WHERE id=@admin_id
        )
            THROW 50001,'El administrador no existe.',1;

        IF NOT EXISTS (
            SELECT 1
            FROM users
            WHERE id=@admin_id
              AND role='admin'
        )
            THROW 50002,'El usuario no tiene permisos de administrador.',1;

        IF NOT EXISTS (
            SELECT 1
            FROM tasks
            WHERE id=@tarea_id
        )
            THROW 50003,'La tarea no existe.',1;

        IF NOT EXISTS (
            SELECT 1
            FROM users
            WHERE id=@nuevo_asignado
              AND is_active=1
        )
            THROW 50004,'El usuario asignado no existe o está inactivo.',1;

        UPDATE tasks
        SET
            assigned_user_id=@nuevo_asignado,
            updated_at=SYSUTCDATETIME()
        WHERE id=@tarea_id;

        INSERT INTO task_history(
            task_id,
            action,
            performed_by
        )
        VALUES(
            @tarea_id,
            CONCAT(
                'Task reassigned to user ',
                @nuevo_asignado
            ),
            @admin_id
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT>0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO