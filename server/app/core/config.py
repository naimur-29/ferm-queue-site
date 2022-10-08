from pydantic import BaseSettings

class Settings_v1(BaseSettings):
    api_v1_str: str = "/api/v1"
    jwt_secret_key: str
    jwt_refresh_secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60*5 # 5 hours
    refresh_token_expire_minutes: int = 60*24*7 # 7 days
    project_name: str = "Ferm Queue Server"
    
    # Other Info
    admin: str = ""
    
    # Database
    database_uri: str = "mongodb://localhost:27017"
    
    class Config:
        env_file = '.env'
        
settings = Settings_v1()