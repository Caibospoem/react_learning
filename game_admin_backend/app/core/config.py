from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Game Admin Backend"
    api_prefix: str = "/api"
    secret_key: str = "dev_secret_key_change_me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120
    database_url: str = "sqlite:///./game_admin.db"
    redis_url: str = "redis://localhost:6379/0"
    upload_dir: str = "app/storage/uploads"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
