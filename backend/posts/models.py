from django.db import models
from cloudinary.models import CloudinaryField
from users.models import User, Group

class Post(models.Model):
    MEDIA_TYPES = [
        ('text', 'Text Only'),
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    text = models.TextField(blank=True)
    media = CloudinaryField('posts/media/', blank=True, null=True)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.author.username} in {self.group.name} at {self.created_at}"
    
    @property
    def is_media_post(self):
        return self.media_type in ['image', 'video']
    
    @property
    def is_text_only(self):
        return self.media_type == 'text'
