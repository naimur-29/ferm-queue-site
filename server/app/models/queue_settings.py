from beanie import Document, Indexed

class QueueSettings(Document):
    name: Indexed(str, unique=True)
    state: bool
    
    class Collections:
        name = "queue_settings"