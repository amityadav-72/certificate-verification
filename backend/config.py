"""
Application configuration — loads Azure credentials from environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Reads settings from environment variables or a .env file.
    """

    azure_storage_account: str = ""
    azure_table_name: str = "certificates"
    azure_table_sas_token: str = ""

    # Support Connection String configuration
    azure_storage_connection_string: str = ""
    table_name: str = ""

    # Comma-separated allowed CORS origins
    cors_origins: str = "http://localhost:5173,http://localhost:5174"

    @property
    def is_azure_configured(self) -> bool:
        has_conn_string = bool(self.azure_storage_connection_string)
        has_sas = bool(
            self.azure_storage_account
            and self.azure_storage_account != "your_storage_account_name"
            and self.azure_table_sas_token
            and len(self.azure_table_sas_token) > 10
        )
        return has_conn_string or has_sas

    @property
    def active_table_name(self) -> str:
        return self.table_name if self.table_name else self.azure_table_name

    @property
    def table_endpoint(self) -> str:
        return f"https://{self.azure_storage_account}.table.core.windows.net"

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
