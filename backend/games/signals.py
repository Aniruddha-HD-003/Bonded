from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from posts.models import Post
from events.models import Event
from comments.models import Comment
from reactions.models import Reaction
from .models import Streak, Challenge, ChallengeProgress, Achievement, UserAchievement
from django.db.models import Count

@receiver(post_save, sender=Post)
def update_post_streak(sender, instance, created, **kwargs):
    """Update posting streak when a new post is created"""
    if created:
        try:
            streak, created = Streak.objects.get_or_create(
                user=instance.author,
                group=instance.group,
                streak_type='post',
                defaults={
                    'current_streak': 1,
                    'longest_streak': 1,
                    'last_activity': timezone.now()
                }
            )
            if not created:
                streak.update_streak()
            
            # Update post-related challenges
            update_post_challenges(instance)
            # Award achievements
            check_and_award_achievements(instance.author, group=instance.group)
        except Exception as e:
            print(f"Error updating post streak: {e}")

@receiver(post_save, sender=Event)
def update_event_streak(sender, instance, created, **kwargs):
    """Update event creation streak when a new event is created"""
    if created:
        try:
            streak, created = Streak.objects.get_or_create(
                user=instance.creator,
                group=instance.group,
                streak_type='event',
                defaults={
                    'current_streak': 1,
                    'longest_streak': 1,
                    'last_activity': timezone.now()
                }
            )
            if not created:
                streak.update_streak()
            
            # Update event-related challenges
            update_event_challenges(instance)
            # Award achievements
            check_and_award_achievements(instance.creator, group=instance.group)
        except Exception as e:
            print(f"Error updating event streak: {e}")

@receiver(post_save, sender=Comment)
def update_comment_streak(sender, instance, created, **kwargs):
    """Update commenting streak when a new comment is created"""
    if created:
        try:
            streak, created = Streak.objects.get_or_create(
                user=instance.user,
                group=instance.post.group,
                streak_type='comment',
                defaults={
                    'current_streak': 1,
                    'longest_streak': 1,
                    'last_activity': timezone.now()
                }
            )
            if not created:
                streak.update_streak()
            
            # Update comment-related challenges
            update_comment_challenges(instance)
            # Award achievements
            check_and_award_achievements(instance.user, group=instance.post.group)
        except Exception as e:
            print(f"Error updating comment streak: {e}")

@receiver(post_save, sender=Reaction)
def update_reaction_streak(sender, instance, created, **kwargs):
    """Update reaction streak when a new reaction is created"""
    if created:
        try:
            streak, created = Streak.objects.get_or_create(
                user=instance.user,
                group=instance.post.group,
                streak_type='reaction',
                defaults={
                    'current_streak': 1,
                    'longest_streak': 1,
                    'last_activity': timezone.now()
                }
            )
            if not created:
                streak.update_streak()
            
            # Update reaction-related challenges
            update_reaction_challenges(instance)
            # Award achievements
            check_and_award_achievements(instance.user, group=instance.post.group)
        except Exception as e:
            print(f"Error updating reaction streak: {e}")

def update_post_challenges(post):
    """Update challenges related to posting"""
    try:
        # Get active challenges for the group
        active_challenges = Challenge.objects.filter(
            group=post.group,
            is_active=True,
            category='post',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        
        for challenge in active_challenges:
            progress, created = ChallengeProgress.objects.get_or_create(
                challenge=challenge,
                user=post.author,
                defaults={'current_count': 0}
            )
            progress.update_progress(1)
    except Exception as e:
        print(f"Error updating post challenges: {e}")

def update_event_challenges(event):
    """Update challenges related to event creation"""
    try:
        # Get active challenges for the group
        active_challenges = Challenge.objects.filter(
            group=event.group,
            is_active=True,
            category='event',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        
        for challenge in active_challenges:
            progress, created = ChallengeProgress.objects.get_or_create(
                challenge=challenge,
                user=event.creator,
                defaults={'current_count': 0}
            )
            progress.update_progress(1)
    except Exception as e:
        print(f"Error updating event challenges: {e}")

def update_comment_challenges(comment):
    """Update challenges related to commenting"""
    try:
        # Get active challenges for the group
        active_challenges = Challenge.objects.filter(
            group=comment.post.group,
            is_active=True,
            category='interaction',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        
        for challenge in active_challenges:
            progress, created = ChallengeProgress.objects.get_or_create(
                challenge=challenge,
                user=comment.user,
                defaults={'current_count': 0}
            )
            progress.update_progress(1)
    except Exception as e:
        print(f"Error updating comment challenges: {e}")

def update_reaction_challenges(reaction):
    """Update challenges related to reactions"""
    try:
        # Get active challenges for the group
        active_challenges = Challenge.objects.filter(
            group=reaction.post.group,
            is_active=True,
            category='engagement',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        
        for challenge in active_challenges:
            progress, created = ChallengeProgress.objects.get_or_create(
                challenge=challenge,
                user=reaction.user,
                defaults={'current_count': 0}
            )
            progress.update_progress(1)
    except Exception as e:
        print(f"Error updating reaction challenges: {e}")

def check_and_award_achievements(user, group=None):
    """
    Check all active achievements and award those whose criteria are met by the user.
    This is a simple implementation for common badge/milestone types.
    """
    achievements = Achievement.objects.filter(is_active=True)
    for achievement in achievements:
        # Avoid duplicate awards
        if UserAchievement.objects.filter(user=user, achievement=achievement, group=group).exists():
            continue
        criteria = achievement.criteria or {}
        met = False
        # Example criteria: {"posts": 1}, {"comments": 10}, {"events": 5}, {"reactions": 100}
        if 'posts' in criteria:
            from posts.models import Post
            count = Post.objects.filter(author=user, group=group).count() if group else Post.objects.filter(author=user).count()
            if count >= criteria['posts']:
                met = True
        if 'comments' in criteria:
            from comments.models import Comment
            count = Comment.objects.filter(user=user, post__group=group).count() if group else Comment.objects.filter(user=user).count()
            if count >= criteria['comments']:
                met = True
        if 'events' in criteria:
            from events.models import Event
            count = Event.objects.filter(creator=user, group=group).count() if group else Event.objects.filter(creator=user).count()
            if count >= criteria['events']:
                met = True
        if 'reactions' in criteria:
            from reactions.models import Reaction
            count = Reaction.objects.filter(user=user, post__group=group).count() if group else Reaction.objects.filter(user=user).count()
            if count >= criteria['reactions']:
                met = True
        if 'streak' in criteria:
            from .models import Streak
            streak_type = criteria['streak'].get('type')
            streak_length = criteria['streak'].get('length', 1)
            qs = Streak.objects.filter(user=user, is_active=True)
            if group:
                qs = qs.filter(group=group)
            if streak_type:
                qs = qs.filter(streak_type=streak_type)
            if qs.filter(current_streak__gte=streak_length).exists():
                met = True
        if met:
            UserAchievement.objects.create(user=user, achievement=achievement, group=group, is_group=bool(group)) 