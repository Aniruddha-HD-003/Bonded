from rest_framework import serializers
from .models import Challenge, ChallengeProgress, Streak, Leaderboard, LeaderboardEntry, Poll, PollOption, PollVote, Achievement, UserAchievement, TwoTruthsAndLie, TwoTruthsAndLieGuess, WouldYouRather, WouldYouRatherVote, ThisOrThat, ThisOrThatVote, FillInTheBlank, FillInTheBlankResponse
from users.models import GroupMembership

class ChallengeSerializer(serializers.ModelSerializer):
    creator_username = serializers.SerializerMethodField()
    is_current = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    progress_count = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'group', 'title', 'description', 'challenge_type', 'category',
            'target_count', 'points_reward', 'start_date', 'end_date', 'is_active',
            'creator_username', 'is_current', 'days_remaining', 'progress_count',
            'completion_rate', 'created_at'
        ]
        read_only_fields = ['id', 'creator_username', 'is_current', 'days_remaining', 
                           'progress_count', 'completion_rate', 'created_at']
    
    def get_creator_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_progress_count(self, obj):
        return obj.progress.filter(is_completed=True).count()
    
    def get_completion_rate(self, obj):
        total_members = obj.group.memberships.count()
        if total_members == 0:
            return 0
        completed = obj.progress.filter(is_completed=True).count()
        return round((completed / total_members) * 100, 1)

class ChallengeProgressSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = ChallengeProgress
        fields = [
            'id', 'challenge', 'challenge_title', 'user', 'user_username',
            'current_count', 'is_completed', 'completed_at', 'last_activity',
            'progress_percentage'
        ]
        read_only_fields = ['id', 'user_username', 'challenge_title', 'completed_at', 
                           'last_activity', 'progress_percentage']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.challenge.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username
    
    def get_progress_percentage(self, obj):
        if obj.challenge.target_count == 0:
            return 0
        return min(100, round((obj.current_count / obj.challenge.target_count) * 100, 1))

class StreakSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    
    class Meta:
        model = Streak
        fields = [
            'id', 'user', 'user_username', 'group', 'streak_type',
            'current_streak', 'longest_streak', 'last_activity', 'is_active'
        ]
        read_only_fields = ['id', 'user_username', 'current_streak', 'longest_streak', 
                           'last_activity', 'is_active']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username

class LeaderboardSerializer(serializers.ModelSerializer):
    entry_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = [
            'id', 'group', 'period', 'start_date', 'end_date', 'is_active', 'entry_count'
        ]
        read_only_fields = ['id', 'entry_count']
    
    def get_entry_count(self, obj):
        return obj.entries.count()

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = [
            'id', 'leaderboard', 'user', 'username', 'points', 'rank',
            'posts_count', 'events_count', 'comments_count', 'reactions_count',
            'challenges_completed', 'streaks_maintained'
        ]
        read_only_fields = ['id', 'points', 'rank', 'posts_count', 'events_count',
                           'comments_count', 'reactions_count', 'challenges_completed',
                           'streaks_maintained']

class UserStatsSerializer(serializers.Serializer):
    """Serializer for user statistics across all games"""
    user_username = serializers.CharField()
    total_points = serializers.IntegerField()
    total_posts = serializers.IntegerField()
    total_events = serializers.IntegerField()
    total_comments = serializers.IntegerField()
    total_reactions = serializers.IntegerField()
    challenges_completed = serializers.IntegerField()
    current_streaks = serializers.DictField()
    longest_streaks = serializers.DictField()
    rank = serializers.IntegerField(required=False)

class PollOptionSerializer(serializers.ModelSerializer):
    votes_count = serializers.SerializerMethodField()
    class Meta:
        model = PollOption
        fields = ['id', 'text', 'order', 'votes_count']
    def get_votes_count(self, obj):
        return obj.votes.count()

class PollVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollVote
        fields = ['id', 'poll', 'option', 'user', 'voted_at']
        read_only_fields = ['id', 'user', 'voted_at']

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True)
    total_votes = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()
    created_by_username = serializers.SerializerMethodField()
    class Meta:
        model = Poll
        fields = [
            'id', 'group', 'question', 'is_active', 'allow_multiple', 'created_by',
            'created_at', 'options', 'total_votes', 'has_voted', 'created_by_username'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'total_votes', 'has_voted', 'created_by_username']
    def get_total_votes(self, obj):
        return obj.votes.count()
    def get_has_voted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.votes.filter(user=user).exists()
    def get_created_by_username(self, obj):
        return obj.created_by.username
    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        poll = Poll.objects.create(**validated_data)
        for idx, option in enumerate(options_data):
            PollOption.objects.create(poll=poll, text=option['text'], order=idx)
        return poll

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'achievement_type', 'criteria', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    achievement_id = serializers.PrimaryKeyRelatedField(queryset=Achievement.objects.all(), source='achievement', write_only=True)

    class Meta:
        model = UserAchievement
        fields = [
            'id', 'user', 'achievement', 'achievement_id', 'awarded_at', 'group', 'is_group'
        ]
        read_only_fields = ['id', 'awarded_at', 'achievement']

# Social Icebreakers Serializers
class TwoTruthsAndLieSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    guess_count = serializers.SerializerMethodField()
    correct_guesses = serializers.SerializerMethodField()
    has_guessed = serializers.SerializerMethodField()
    
    class Meta:
        model = TwoTruthsAndLie
        fields = [
            'id', 'group', 'user', 'user_username', 'statement1', 'statement2', 'statement3',
            'lie_statement', 'is_active', 'created_at', 'guess_count', 'correct_guesses', 'has_guessed'
        ]
        read_only_fields = ['id', 'user', 'user_username', 'created_at', 'guess_count', 'correct_guesses', 'has_guessed']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username
    
    def get_guess_count(self, obj):
        return obj.guesses.count()
    
    def get_correct_guesses(self, obj):
        return obj.guesses.filter(is_correct=True).count()
    
    def get_has_guessed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.guesses.filter(guesser=user).exists()
    
    def validate_lie_statement(self, value):
        """Validate that lie_statement is a valid choice"""
        if value not in [1, 2, 3]:
            raise serializers.ValidationError("lie_statement must be 1, 2, or 3")
        return value
    
    def validate(self, data):
        """Validate that all statements are provided"""
        if not data.get('statement1', '').strip():
            raise serializers.ValidationError("Statement 1 is required")
        if not data.get('statement2', '').strip():
            raise serializers.ValidationError("Statement 2 is required")
        if not data.get('statement3', '').strip():
            raise serializers.ValidationError("Statement 3 is required")
        return data

class TwoTruthsAndLieGuessSerializer(serializers.ModelSerializer):
    guesser_username = serializers.SerializerMethodField()
    
    class Meta:
        model = TwoTruthsAndLieGuess
        fields = [
            'id', 'game', 'guesser', 'guesser_username', 'guessed_lie', 'is_correct', 'guessed_at'
        ]
        read_only_fields = ['id', 'guesser_username', 'is_correct', 'guessed_at']
    
    def get_guesser_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.guesser, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.guesser.username

class WouldYouRatherSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    option_a_votes = serializers.SerializerMethodField()
    option_b_votes = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()
    user_choice = serializers.SerializerMethodField()
    
    class Meta:
        model = WouldYouRather
        fields = [
            'id', 'group', 'question', 'option_a', 'option_b', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'total_votes', 'option_a_votes', 'option_b_votes',
            'has_voted', 'user_choice'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at', 'total_votes', 
                           'option_a_votes', 'option_b_votes', 'has_voted', 'user_choice']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_total_votes(self, obj):
        return obj.votes.count()
    
    def get_option_a_votes(self, obj):
        return obj.votes.filter(choice='A').count()
    
    def get_option_b_votes(self, obj):
        return obj.votes.filter(choice='B').count()
    
    def get_has_voted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.votes.filter(voter=user).exists()
    
    def get_user_choice(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            vote = obj.votes.get(voter=user)
            return vote.choice
        except WouldYouRatherVote.DoesNotExist:
            return None

class WouldYouRatherVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = WouldYouRatherVote
        fields = ['id', 'poll', 'voter', 'choice', 'voted_at']
        read_only_fields = ['id', 'voter', 'voted_at']

class ThisOrThatSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    option_a_votes = serializers.SerializerMethodField()
    option_b_votes = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField()
    user_choice = serializers.SerializerMethodField()
    
    class Meta:
        model = ThisOrThat
        fields = [
            'id', 'group', 'question', 'option_a', 'option_b', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'total_votes', 'option_a_votes', 'option_b_votes',
            'has_voted', 'user_choice'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at', 'total_votes', 
                           'option_a_votes', 'option_b_votes', 'has_voted', 'user_choice']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_total_votes(self, obj):
        return obj.votes.count()
    
    def get_option_a_votes(self, obj):
        return obj.votes.filter(choice='A').count()
    
    def get_option_b_votes(self, obj):
        return obj.votes.filter(choice='B').count()
    
    def get_has_voted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.votes.filter(voter=user).exists()
    
    def get_user_choice(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            vote = obj.votes.get(voter=user)
            return vote.choice
        except ThisOrThatVote.DoesNotExist:
            return None

class ThisOrThatVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThisOrThatVote
        fields = ['id', 'poll', 'voter', 'choice', 'voted_at']
        read_only_fields = ['id', 'voter', 'voted_at']

class FillInTheBlankSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    response_count = serializers.SerializerMethodField()
    has_responded = serializers.SerializerMethodField()
    user_response = serializers.SerializerMethodField()
    
    class Meta:
        model = FillInTheBlank
        fields = [
            'id', 'group', 'template', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'response_count', 'has_responded', 'user_response'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at', 'response_count', 
                           'has_responded', 'user_response']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_response_count(self, obj):
        return obj.responses.count()
    
    def get_has_responded(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.responses.filter(user=user).exists()
    
    def get_user_response(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            response = obj.responses.get(user=user)
            return response.filled_text
        except FillInTheBlankResponse.DoesNotExist:
            return None

class FillInTheBlankResponseSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    
    class Meta:
        model = FillInTheBlankResponse
        fields = [
            'id', 'game', 'user', 'user_username', 'filled_text', 'created_at'
        ]
        read_only_fields = ['id', 'user_username', 'created_at']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username 