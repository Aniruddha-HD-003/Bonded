from django.db import models
from users.models import User
from posts.models import Post

class Reaction(models.Model):
    REACTION_CHOICES = [
        ("like", "Like"),
        ("love", "Love"),
        ("laugh", "Laugh"),
        ("wow", "Wow"),
        ("sad", "Sad"),
        ("angry", "Angry"),
        ("custom", "Custom Emoji"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reactions")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reactions")
    type = models.CharField(max_length=20, choices=REACTION_CHOICES, default="like")
    emoji = models.CharField(max_length=10, blank=True, null=True, help_text="Custom emoji if type is custom")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user.username} reacted {self.type} to Post {self.post.id}"
