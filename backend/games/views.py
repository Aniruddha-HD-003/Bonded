from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Count, Sum
from datetime import timedelta

from .models import Challenge, ChallengeProgress, Streak, Leaderboard, LeaderboardEntry, Poll, PollOption, PollVote, Achievement, UserAchievement, TwoTruthsAndLie, TwoTruthsAndLieGuess, WouldYouRather, WouldYouRatherVote, ThisOrThat, ThisOrThatVote, FillInTheBlank, FillInTheBlankResponse
from .serializers import (
    ChallengeSerializer, ChallengeProgressSerializer, StreakSerializer,
    LeaderboardSerializer, LeaderboardEntrySerializer, UserStatsSerializer,
    PollSerializer, PollOptionSerializer, PollVoteSerializer,
    AchievementSerializer, UserAchievementSerializer, TwoTruthsAndLieSerializer, TwoTruthsAndLieGuessSerializer,
    WouldYouRatherSerializer, WouldYouRatherVoteSerializer, ThisOrThatSerializer, ThisOrThatVoteSerializer,
    FillInTheBlankSerializer, FillInTheBlankResponseSerializer
)
from users.models import Group, GroupMembership
from posts.models import Post
from events.models import Event
from comments.models import Comment
from reactions.models import Reaction
from posts.serializers import PostSerializer
import random
from rest_framework.views import APIView
from collections import Counter
import re

# Challenge Views
class ChallengeListCreateView(generics.ListCreateAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return Challenge.objects.filter(group_id=group_id).order_by('-created_at')
        return Challenge.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(created_by=self.request.user, group_id=group_id)

class ChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Challenge.objects.all()

class ChallengeProgressView(generics.ListCreateAPIView):
    serializer_class = ChallengeProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        challenge_id = self.request.query_params.get('challenge')
        group_id = self.request.query_params.get('group')
        if challenge_id:
            return ChallengeProgress.objects.filter(challenge_id=challenge_id)
        elif group_id:
            return ChallengeProgress.objects.filter(challenge__group_id=group_id)
        return ChallengeProgress.objects.none()

    def perform_create(self, serializer):
        challenge_id = self.request.data.get('challenge')
        progress, created = ChallengeProgress.objects.get_or_create(
            challenge_id=challenge_id,
            user=self.request.user,
            defaults={'current_count': 0}
        )
        if not created:
            progress.update_progress(1)
        serializer.instance = progress

# Streak Views
class StreakListView(generics.ListAPIView):
    serializer_class = StreakSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        user_id = self.request.query_params.get('user')
        if group_id:
            queryset = Streak.objects.filter(group_id=group_id)
            if user_id:
                queryset = queryset.filter(user_id=user_id)
            return queryset
        return Streak.objects.none()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_streak(request):
    """Update streak for a specific activity"""
    group_id = request.data.get('group')
    streak_type = request.data.get('streak_type')
    
    if not group_id or not streak_type:
        return Response({'error': 'Group and streak type are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        streak, created = Streak.objects.get_or_create(
            user=request.user,
            group_id=group_id,
            streak_type=streak_type,
            defaults={
                'current_streak': 0,
                'longest_streak': 0,
                'last_activity': timezone.now()
            }
        )
        
        if not created:
            streak.update_streak()
        
        serializer = StreakSerializer(streak)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Leaderboard Views
class LeaderboardListView(generics.ListAPIView):
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return Leaderboard.objects.filter(group_id=group_id, is_active=True)
        return Leaderboard.objects.none()

class LeaderboardEntryListView(generics.ListAPIView):
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        leaderboard_id = self.request.query_params.get('leaderboard')
        group_id = self.request.query_params.get('group')
        period = self.request.query_params.get('period', 'all_time')
        
        if leaderboard_id:
            return LeaderboardEntry.objects.filter(leaderboard_id=leaderboard_id)
        elif group_id:
            # Get the most recent leaderboard for the specified period
            leaderboard = Leaderboard.objects.filter(
                group_id=group_id, 
                period=period, 
                is_active=True
            ).order_by('-start_date').first()
            
            if leaderboard:
                return LeaderboardEntry.objects.filter(leaderboard=leaderboard)
        
        return LeaderboardEntry.objects.none()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def calculate_leaderboard(request):
    """Calculate and update leaderboard for a group"""
    group_id = request.data.get('group')
    period = request.data.get('period', 'all_time')
    
    if not group_id:
        return Response({'error': 'Group is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create or get leaderboard
        start_date = timezone.now()
        if period == 'daily':
            start_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'weekly':
            start_date = (timezone.now() - timedelta(days=7))
        elif period == 'monthly':
            start_date = (timezone.now() - timedelta(days=30))
        elif period == 'all_time':
            start_date = timezone.now() - timedelta(days=365*10)  # 10 years ago
        
        leaderboard, created = Leaderboard.objects.get_or_create(
            group_id=group_id,
            period=period,
            start_date=start_date,
            defaults={'is_active': True}
        )
        
        # Calculate statistics for each member
        memberships = GroupMembership.objects.filter(group_id=group_id)
        
        for membership in memberships:
            # Get activity counts for the period
            posts_count = Post.objects.filter(
                group_id=group_id,
                author=membership.user,
                created_at__gte=start_date
            ).count()
            
            events_count = Event.objects.filter(
                group_id=group_id,
                creator=membership.user,
                created_at__gte=start_date
            ).count()
            
            comments_count = Comment.objects.filter(
                post__group_id=group_id,
                user=membership.user,
                created_at__gte=start_date
            ).count()
            
            reactions_count = Reaction.objects.filter(
                post__group_id=group_id,
                user=membership.user,
                created_at__gte=start_date
            ).count()
            
            challenges_completed = ChallengeProgress.objects.filter(
                challenge__group_id=group_id,
                user=membership.user,
                is_completed=True,
                completed_at__gte=start_date
            ).count()
            
            # Get current streaks
            streaks = Streak.objects.filter(
                group_id=group_id,
                user=membership.user,
                is_active=True
            )
            streaks_maintained = sum(streak.current_streak for streak in streaks)
            
            # Calculate points
            points = (
                posts_count * 5 +
                events_count * 10 +
                comments_count * 2 +
                reactions_count * 1 +
                challenges_completed * 20 +
                streaks_maintained * 15
            )
            
            # Create or update leaderboard entry
            entry, created = LeaderboardEntry.objects.get_or_create(
                leaderboard=leaderboard,
                user=membership.user,
                defaults={
                    'username': membership.username,
                    'points': points,
                    'posts_count': posts_count,
                    'events_count': events_count,
                    'comments_count': comments_count,
                    'reactions_count': reactions_count,
                    'challenges_completed': challenges_completed,
                    'streaks_maintained': streaks_maintained
                }
            )
            
            if not created:
                entry.points = points
                entry.posts_count = posts_count
                entry.events_count = events_count
                entry.comments_count = comments_count
                entry.reactions_count = reactions_count
                entry.challenges_completed = challenges_completed
                entry.streaks_maintained = streaks_maintained
                entry.save()
        
        # Update ranks
        entries = LeaderboardEntry.objects.filter(leaderboard=leaderboard).order_by('-points')
        for rank, entry in enumerate(entries, 1):
            entry.rank = rank
            entry.save()
        
        return Response({'message': 'Leaderboard calculated successfully'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# User Statistics View
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get comprehensive user statistics"""
    group_id = request.query_params.get('group')
    user_id = request.query_params.get('user', request.user.id)
    
    if not group_id:
        return Response({'error': 'Group is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        membership = GroupMembership.objects.get(group_id=group_id, user_id=user_id)
        
        # Get all activity counts
        total_posts = Post.objects.filter(group_id=group_id, author_id=user_id).count()
        total_events = Event.objects.filter(group_id=group_id, creator_id=user_id).count()
        total_comments = Comment.objects.filter(post__group_id=group_id, user_id=user_id).count()
        total_reactions = Reaction.objects.filter(post__group_id=group_id, user_id=user_id).count()
        challenges_completed = ChallengeProgress.objects.filter(
            challenge__group_id=group_id, 
            user_id=user_id, 
            is_completed=True
        ).count()
        
        # Get streaks
        streaks = Streak.objects.filter(group_id=group_id, user_id=user_id, is_active=True)
        current_streaks = {streak.streak_type: streak.current_streak for streak in streaks}
        longest_streaks = {streak.streak_type: streak.longest_streak for streak in streaks}
        
        # Calculate total points
        total_points = (
            total_posts * 5 +
            total_events * 10 +
            total_comments * 2 +
            total_reactions * 1 +
            challenges_completed * 20 +
            sum(current_streaks.values()) * 15
        )
        
        # Get rank (optional)
        rank = None
        leaderboard = Leaderboard.objects.filter(
            group_id=group_id, 
            period='all_time', 
            is_active=True
        ).order_by('-start_date').first()
        
        if leaderboard:
            entry = LeaderboardEntry.objects.filter(
                leaderboard=leaderboard,
                user_id=user_id
            ).first()
            if entry:
                rank = entry.rank
        
        stats = {
            'user_username': membership.username,
            'total_points': total_points,
            'total_posts': total_posts,
            'total_events': total_events,
            'total_comments': total_comments,
            'total_reactions': total_reactions,
            'challenges_completed': challenges_completed,
            'current_streaks': current_streaks,
            'longest_streaks': longest_streaks,
            'rank': rank
        }
        
        serializer = UserStatsSerializer(stats)
        return Response(serializer.data)
    
    except GroupMembership.DoesNotExist:
        return Response({'error': 'User not found in group'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Auto-update streaks when users perform actions
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def auto_update_streaks(request):
    """Automatically update streaks based on user activity"""
    group_id = request.data.get('group')
    activity_type = request.data.get('activity_type')  # post, event, comment, reaction, login
    
    if not group_id or not activity_type:
        return Response({'error': 'Group and activity type are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Map activity type to streak type
        streak_type_mapping = {
            'post': 'post',
            'event': 'event',
            'comment': 'comment',
            'reaction': 'reaction',
            'login': 'login'
        }
        
        streak_type = streak_type_mapping.get(activity_type)
        if not streak_type:
            return Response({'error': 'Invalid activity type'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update streak
        streak, created = Streak.objects.get_or_create(
            user=request.user,
            group_id=group_id,
            streak_type=streak_type,
            defaults={
                'current_streak': 1,
                'longest_streak': 1,
                'last_activity': timezone.now()
            }
        )
        
        if not created:
            streak.update_streak()
        
        serializer = StreakSerializer(streak)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Poll Views
class PollListCreateView(generics.ListCreateAPIView):
    serializer_class = PollSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return Poll.objects.filter(group_id=group_id).order_by('-created_at')
        return Poll.objects.none()
    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(created_by=self.request.user, group_id=group_id)

class PollDetailView(generics.RetrieveAPIView):
    serializer_class = PollSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Poll.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_poll(request, poll_id):
    poll = Poll.objects.get(id=poll_id)
    option_ids = request.data.get('option_ids', [])
    if not isinstance(option_ids, list):
        option_ids = [option_ids]
    if not poll.allow_multiple and len(option_ids) > 1:
        return Response({'error': 'Multiple votes not allowed for this poll.'}, status=400)
    # Remove previous votes for this poll by this user
    PollVote.objects.filter(poll=poll, user=request.user).delete()
    # Add new votes
    for option_id in option_ids:
        option = PollOption.objects.get(id=option_id, poll=poll)
        PollVote.objects.create(poll=poll, option=option, user=request.user)
    return Response({'success': True})

# Achievement Views
class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.filter(is_active=True)
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserAchievementListView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user', self.request.user.id)
        group_id = self.request.query_params.get('group', None)
        qs = UserAchievement.objects.filter(user_id=user_id)
        if group_id:
            qs = qs.filter(group_id=group_id)
        return qs.order_by('-awarded_at')

class UserAchievementCreateView(generics.CreateAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAdminUser]

class PhotoMemoryGameView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Handle both query_params (DRF) and GET (Django)
        group_id = getattr(request, 'query_params', request.GET).get('group')
        if not group_id:
            return Response({'error': 'Group ID required.'}, status=400)
        
        try:
            # Get posts with images for the group
            posts = Post.objects.filter(group_id=group_id).exclude(media='').order_by('?')[:12]
            
            if not posts.exists():
                return Response({'error': 'No images found in group posts.'}, status=400)
            
            # Only return id, media, and user info
            data = [
                {
                    'post_id': post.id,
                    'media': post.media.url if hasattr(post.media, 'url') else post.media,
                    'user_id': post.author.id if post.author else None,
                    'username': post.author.username if hasattr(post.author, 'username') else '',
                }
                for post in posts
            ]
            # Duplicate and shuffle for memory pairs
            pairs = data * 2
            random.shuffle(pairs)
            return Response({'cards': pairs})
        except Exception as e:
            return Response({'error': f'Error processing images: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def word_association_game(request):
    """Word association game based on group posts"""
    group_id = request.query_params.get('group')
    
    if not group_id:
        return Response({'error': 'Group parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get words from group posts
        posts = Post.objects.filter(group_id=group_id, content__isnull=False).exclude(content='')
        words = []
        
        for post in posts:
            # Extract words from post content
            post_words = re.findall(r'\b[a-zA-Z]{3,}\b', post.content.lower())
            words.extend(post_words)
        
        # Get most common words (excluding common stop words)
        stop_words = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'that', 'this', 'with', 'have', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were', 'what', 'word', 'work', 'year', 'back', 'come', 'each', 'even', 'first', 'give', 'into', 'look', 'must', 'name', 'other', 'over', 'part', 'people', 'same', 'seem', 'show', 'tell', 'than', 'their', 'them', 'then', 'think', 'three', 'through', 'under', 'very', 'want', 'way', 'well', 'went', 'were', 'what', 'when', 'where', 'which', 'while', 'will', 'with', 'word', 'work', 'would', 'year', 'your'}
        
        word_counts = Counter(words)
        # Filter out stop words and get top 20 words
        filtered_words = [word for word, count in word_counts.most_common(20) if word not in stop_words and count >= 2]
        
        if len(filtered_words) < 5:
            return Response({'error': 'Not enough unique words in group posts to play'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Shuffle words for variety
        random.shuffle(filtered_words)
        
        return Response({
            'words': filtered_words[:10],  # Return top 10 words
            'total_words': len(filtered_words)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Social Icebreakers Views
class TwoTruthsAndLieListCreateView(generics.ListCreateAPIView):
    serializer_class = TwoTruthsAndLieSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return TwoTruthsAndLie.objects.filter(group_id=group_id, is_active=True).order_by('-created_at')
        return TwoTruthsAndLie.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(user=self.request.user, group_id=group_id)

class TwoTruthsAndLieDetailView(generics.RetrieveAPIView):
    serializer_class = TwoTruthsAndLieSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TwoTruthsAndLie.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def guess_two_truths_lie(request, game_id):
    """Submit a guess for Two Truths and a Lie game"""
    try:
        game = TwoTruthsAndLie.objects.get(id=game_id)
        guessed_lie = request.data.get('guessed_lie')
        
        if not guessed_lie or guessed_lie not in [1, 2, 3]:
            return Response({'error': 'Valid guess (1, 2, or 3) is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already guessed
        if game.guesses.filter(guesser=request.user).exists():
            return Response({'error': 'You have already guessed for this game'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if guess is correct
        is_correct = guessed_lie == game.lie_statement
        
        # Create guess
        guess = TwoTruthsAndLieGuess.objects.create(
            game=game,
            guesser=request.user,
            guessed_lie=guessed_lie,
            is_correct=is_correct
        )
        
        serializer = TwoTruthsAndLieGuessSerializer(guess)
        return Response({
            'guess': serializer.data,
            'is_correct': is_correct,
            'correct_lie': game.lie_statement
        })
        
    except TwoTruthsAndLie.DoesNotExist:
        return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class WouldYouRatherListCreateView(generics.ListCreateAPIView):
    serializer_class = WouldYouRatherSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return WouldYouRather.objects.filter(group_id=group_id, is_active=True).order_by('-created_at')
        return WouldYouRather.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(created_by=self.request.user, group_id=group_id)

class WouldYouRatherDetailView(generics.RetrieveAPIView):
    serializer_class = WouldYouRatherSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = WouldYouRather.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_would_you_rather(request, poll_id):
    """Vote on a Would You Rather poll"""
    try:
        poll = WouldYouRather.objects.get(id=poll_id)
        choice = request.data.get('choice')
        
        if not choice or choice not in ['A', 'B']:
            return Response({'error': 'Valid choice (A or B) is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already voted
        if poll.votes.filter(voter=request.user).exists():
            return Response({'error': 'You have already voted on this poll'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create vote
        vote = WouldYouRatherVote.objects.create(
            poll=poll,
            voter=request.user,
            choice=choice
        )
        
        serializer = WouldYouRatherVoteSerializer(vote)
        return Response(serializer.data)
        
    except WouldYouRather.DoesNotExist:
        return Response({'error': 'Poll not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ThisOrThatListCreateView(generics.ListCreateAPIView):
    serializer_class = ThisOrThatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return ThisOrThat.objects.filter(group_id=group_id, is_active=True).order_by('-created_at')
        return ThisOrThat.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(created_by=self.request.user, group_id=group_id)

class ThisOrThatDetailView(generics.RetrieveAPIView):
    serializer_class = ThisOrThatSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ThisOrThat.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_this_or_that(request, poll_id):
    """Vote on a This or That poll"""
    try:
        poll = ThisOrThat.objects.get(id=poll_id)
        choice = request.data.get('choice')
        
        if not choice or choice not in ['A', 'B']:
            return Response({'error': 'Valid choice (A or B) is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already voted
        if poll.votes.filter(voter=request.user).exists():
            return Response({'error': 'You have already voted on this poll'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create vote
        vote = ThisOrThatVote.objects.create(
            poll=poll,
            voter=request.user,
            choice=choice
        )
        
        serializer = ThisOrThatVoteSerializer(vote)
        return Response(serializer.data)
        
    except ThisOrThat.DoesNotExist:
        return Response({'error': 'Poll not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FillInTheBlankListCreateView(generics.ListCreateAPIView):
    serializer_class = FillInTheBlankSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group')
        if group_id:
            return FillInTheBlank.objects.filter(group_id=group_id, is_active=True).order_by('-created_at')
        return FillInTheBlank.objects.none()

    def perform_create(self, serializer):
        group_id = self.request.data.get('group')
        serializer.save(created_by=self.request.user, group_id=group_id)

class FillInTheBlankDetailView(generics.RetrieveAPIView):
    serializer_class = FillInTheBlankSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FillInTheBlank.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_fill_in_blank(request, game_id):
    """Submit a response for Fill in the Blank game"""
    try:
        game = FillInTheBlank.objects.get(id=game_id)
        filled_text = request.data.get('filled_text')
        
        if not filled_text or not filled_text.strip():
            return Response({'error': 'Filled text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already responded
        if game.responses.filter(user=request.user).exists():
            return Response({'error': 'You have already responded to this game'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create response
        response = FillInTheBlankResponse.objects.create(
            game=game,
            user=request.user,
            filled_text=filled_text.strip()
        )
        
        serializer = FillInTheBlankResponseSerializer(response)
        return Response(serializer.data)
        
    except FillInTheBlank.DoesNotExist:
        return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def fill_in_blank_responses(request, game_id):
    """Get all responses for a Fill in the Blank game"""
    try:
        game = FillInTheBlank.objects.get(id=game_id)
        responses = game.responses.all().order_by('created_at')
        serializer = FillInTheBlankResponseSerializer(responses, many=True)
        return Response(serializer.data)
        
    except FillInTheBlank.DoesNotExist:
        return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
