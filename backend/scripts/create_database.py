from pathlib import Path
import sys

import pyodbc

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings


def main() -> None:
    connection = pyodbc.connect(
        f"DRIVER={{{settings.database_driver}}};"
        f"SERVER={settings.database_host},{settings.database_port};"
        "DATABASE=master;"
        f"UID={settings.database_user};"
        f"PWD={settings.database_password.get_secret_value()};"
        f"Encrypt={'yes' if settings.database_encrypt else 'no'};"
        f"TrustServerCertificate={'yes' if settings.database_trust_server_certificate else 'no'};",
        autocommit=True,
    )
    try:
        cursor = connection.cursor()
        cursor.execute(
            f"""
IF DB_ID(N'{settings.database_name}') IS NULL
BEGIN
    CREATE DATABASE [{settings.database_name}]
END
"""
        )
    finally:
        connection.close()


if __name__ == "__main__":
    main()