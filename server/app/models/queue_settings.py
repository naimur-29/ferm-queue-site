from beanie import Document, Indexed

class QueueSettings(Document):
    name: Indexed(str, unique=True)
    state: Indexed(int) = 0
    
    class Collections:
        name = "queue_settings"