from pydantic import BaseSettings

class Settings(BaseSettings):
    database_uri: str = "mongodb://localhost:27017"
    
    class Config:
        env_file = '.env'
        
settings = Settings()