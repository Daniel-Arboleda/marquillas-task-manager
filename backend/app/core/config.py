from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    app_name: str = "Marquillas Task Manager API"
    app_env: str = "development"
    app_debug: bool = False

    database_host: str = "sqlserver"
    database_port: int = Field(default=1433, ge=1, le=65535)
    database_name: str = "marquillas_tasks"
    database_user: str = "sa"
    database_password: SecretStr
    database_driver: str = "ODBC Driver 18 for SQL Server"
    database_encrypt: bool = True
    database_trust_server_certificate: bool = True

    jwt_secret_key: SecretStr
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = Field(default=60, ge=1, le=1440)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="mssql+pyodbc",
            username=self.database_user,
            password=self.database_password.get_secret_value(),
            host=self.database_host,
            port=self.database_port,
            database=self.database_name,
            query={
                "driver": self.database_driver,
                "Encrypt": "yes" if self.database_encrypt else "no",
                "TrustServerCertificate": (
                    "yes" if self.database_trust_server_certificate else "no"
                ),
            },
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()