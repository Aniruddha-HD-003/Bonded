from rest_framework import serializers
from .models import Challenge, ChallengeProgress, Streak, Leaderboard, LeaderboardEntry, Poll, PollOption, PollVote, Achievement, UserAchievement, TwoTruthsAndLie, TwoTruthsAndLieGuess, WouldYouRather, WouldYouRatherVote, ThisOrThat, ThisOrThatVote, FillInTheBlank, FillInTheBlankResponse, SpotTheDifference, SpotTheDifferenceAttempt, GuessWho, GuessWhoAttempt, WordCloud, ReactionRace, ReactionRaceParticipant, BirthdayCelebration, BirthdayWish, AnniversaryCelebration, AnniversaryMessage, HolidayGame, HolidayGameParticipant, RandomActOfKindness, KindnessAct
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

# Engagement Games Serializers
class SpotTheDifferenceSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    attempt_count = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    has_attempted = serializers.SerializerMethodField()
    user_attempt = serializers.SerializerMethodField()
    
    class Meta:
        model = SpotTheDifference
        fields = [
            'id', 'group', 'original_image', 'modified_image', 'title', 'description',
            'difficulty', 'differences_count', 'time_limit', 'points_reward',
            'created_by', 'created_by_username', 'is_active', 'created_at',
            'attempt_count', 'average_score', 'has_attempted', 'user_attempt'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at',
                           'attempt_count', 'average_score', 'has_attempted', 'user_attempt']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_attempt_count(self, obj):
        return obj.attempts.count()
    
    def get_average_score(self, obj):
        attempts = obj.attempts.filter(is_completed=True)
        if not attempts:
            return 0
        return round(sum(attempt.score for attempt in attempts) / attempts.count(), 1)
    
    def get_has_attempted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.attempts.filter(user=user).exists()
    
    def get_user_attempt(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            attempt = obj.attempts.get(user=user)
            return SpotTheDifferenceAttemptSerializer(attempt).data
        except SpotTheDifferenceAttempt.DoesNotExist:
            return None

class SpotTheDifferenceAttemptSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    game_title = serializers.CharField(source='game.title', read_only=True)
    
    class Meta:
        model = SpotTheDifferenceAttempt
        fields = [
            'id', 'game', 'game_title', 'user', 'user_username', 'differences_found',
            'time_taken', 'is_completed', 'score', 'attempted_at'
        ]
        read_only_fields = ['id', 'game_title', 'user_username', 'attempted_at']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username

class GuessWhoSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    attempt_count = serializers.SerializerMethodField()
    correct_guesses = serializers.SerializerMethodField()
    has_attempted = serializers.SerializerMethodField()
    user_attempt = serializers.SerializerMethodField()
    
    class Meta:
        model = GuessWho
        fields = [
            'id', 'group', 'title', 'description', 'photo_url', 'correct_user',
            'hint', 'points_reward', 'time_limit', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'attempt_count', 'correct_guesses',
            'has_attempted', 'user_attempt'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at',
                           'attempt_count', 'correct_guesses', 'has_attempted', 'user_attempt']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_attempt_count(self, obj):
        return obj.attempts.count()
    
    def get_correct_guesses(self, obj):
        return obj.attempts.filter(is_correct=True).count()
    
    def get_has_attempted(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.attempts.filter(user=user).exists()
    
    def get_user_attempt(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            attempt = obj.attempts.get(user=user)
            return GuessWhoAttemptSerializer(attempt).data
        except GuessWhoAttempt.DoesNotExist:
            return None

class GuessWhoAttemptSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    guessed_user_username = serializers.SerializerMethodField()
    game_title = serializers.CharField(source='game.title', read_only=True)
    
    class Meta:
        model = GuessWhoAttempt
        fields = [
            'id', 'game', 'game_title', 'user', 'user_username', 'guessed_user',
            'guessed_user_username', 'is_correct', 'time_taken', 'attempted_at'
        ]
        read_only_fields = ['id', 'game_title', 'user_username', 'guessed_user_username',
                           'is_correct', 'attempted_at']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username
    
    def get_guessed_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.guessed_user, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.guessed_user.username

class WordCloudSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordCloud
        fields = [
            'id', 'group', 'period', 'start_date', 'end_date', 'word_data',
            'total_words', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class ReactionRaceSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    has_participated = serializers.SerializerMethodField()
    user_participation = serializers.SerializerMethodField()
    
    class Meta:
        model = ReactionRace
        fields = [
            'id', 'group', 'post', 'title', 'description', 'target_reaction_type',
            'time_limit', 'points_reward', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'participant_count', 'has_participated',
            'user_participation'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at',
                           'participant_count', 'has_participated', 'user_participation']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_participant_count(self, obj):
        return obj.participants.count()
    
    def get_has_participated(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.participants.filter(user=user).exists()
    
    def get_user_participation(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            participation = obj.participants.get(user=user)
            return ReactionRaceParticipantSerializer(participation).data
        except ReactionRaceParticipant.DoesNotExist:
            return None

class ReactionRaceParticipantSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    race_title = serializers.CharField(source='race.title', read_only=True)
    
    class Meta:
        model = ReactionRaceParticipant
        fields = [
            'id', 'race', 'race_title', 'user', 'user_username', 'reaction_time',
            'position', 'points_earned', 'participated_at'
        ]
        read_only_fields = ['id', 'race_title', 'user_username', 'participated_at']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.race.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username

# Seasonal & Special Events Serializers
class BirthdayCelebrationSerializer(serializers.ModelSerializer):
    birthday_person_username = serializers.SerializerMethodField()
    wish_count = serializers.SerializerMethodField()
    has_wished = serializers.SerializerMethodField()
    user_wish = serializers.SerializerMethodField()
    
    class Meta:
        model = BirthdayCelebration
        fields = [
            'id', 'group', 'birthday_person', 'birthday_person_username', 'birthday_date',
            'celebration_date', 'is_active', 'created_at', 'wish_count', 'has_wished', 'user_wish'
        ]
        read_only_fields = ['id', 'created_at', 'wish_count', 'has_wished', 'user_wish']
    
    def get_birthday_person_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.birthday_person, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.birthday_person.username
    
    def get_wish_count(self, obj):
        return obj.wishes.count()
    
    def get_has_wished(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.wishes.filter(from_user=user).exists()
    
    def get_user_wish(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            wish = obj.wishes.get(from_user=user)
            return BirthdayWishSerializer(wish).data
        except BirthdayWish.DoesNotExist:
            return None

class BirthdayWishSerializer(serializers.ModelSerializer):
    from_user_username = serializers.SerializerMethodField()
    celebration_title = serializers.SerializerMethodField()
    
    class Meta:
        model = BirthdayWish
        fields = [
            'id', 'celebration', 'celebration_title', 'from_user', 'from_user_username',
            'message', 'is_anonymous', 'created_at'
        ]
        read_only_fields = ['id', 'celebration_title', 'from_user_username', 'created_at']
    
    def get_from_user_username(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        try:
            membership = GroupMembership.objects.get(user=obj.from_user, group=obj.celebration.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.from_user.username
    
    def get_celebration_title(self, obj):
        return f"Birthday Celebration for {obj.celebration.birthday_person.username}"

class AnniversaryCelebrationSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()
    has_messaged = serializers.SerializerMethodField()
    user_message = serializers.SerializerMethodField()
    
    class Meta:
        model = AnniversaryCelebration
        fields = [
            'id', 'group', 'title', 'description', 'anniversary_date', 'celebration_date',
            'anniversary_type', 'is_active', 'created_at', 'message_count', 'has_messaged', 'user_message'
        ]
        read_only_fields = ['id', 'created_at', 'message_count', 'has_messaged', 'user_message']
    
    def get_message_count(self, obj):
        return obj.messages.count()
    
    def get_has_messaged(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.messages.filter(from_user=user).exists()
    
    def get_user_message(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            message = obj.messages.get(from_user=user)
            return AnniversaryMessageSerializer(message).data
        except AnniversaryMessage.DoesNotExist:
            return None

class AnniversaryMessageSerializer(serializers.ModelSerializer):
    from_user_username = serializers.SerializerMethodField()
    celebration_title = serializers.CharField(source='celebration.title', read_only=True)
    
    class Meta:
        model = AnniversaryMessage
        fields = [
            'id', 'celebration', 'celebration_title', 'from_user', 'from_user_username',
            'message', 'is_anonymous', 'created_at'
        ]
        read_only_fields = ['id', 'celebration_title', 'from_user_username', 'created_at']
    
    def get_from_user_username(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        try:
            membership = GroupMembership.objects.get(user=obj.from_user, group=obj.celebration.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.from_user.username

class HolidayGameSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    has_participated = serializers.SerializerMethodField()
    user_participation = serializers.SerializerMethodField()
    
    class Meta:
        model = HolidayGame
        fields = [
            'id', 'group', 'holiday_type', 'title', 'description', 'game_type',
            'start_date', 'end_date', 'points_reward', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'participant_count', 'has_participated', 'user_participation'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at',
                           'participant_count', 'has_participated', 'user_participation']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_participant_count(self, obj):
        return obj.participants.count()
    
    def get_has_participated(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.participants.filter(user=user).exists()
    
    def get_user_participation(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            participation = obj.participants.get(user=user)
            return HolidayGameParticipantSerializer(participation).data
        except HolidayGameParticipant.DoesNotExist:
            return None

class HolidayGameParticipantSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    game_title = serializers.CharField(source='game.title', read_only=True)
    
    class Meta:
        model = HolidayGameParticipant
        fields = [
            'id', 'game', 'game_title', 'user', 'user_username', 'participation_date',
            'points_earned', 'is_winner'
        ]
        read_only_fields = ['id', 'game_title', 'user_username', 'participation_date']
    
    def get_user_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.user, group=obj.game.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.user.username

class RandomActOfKindnessSerializer(serializers.ModelSerializer):
    created_by_username = serializers.SerializerMethodField()
    target_user_username = serializers.SerializerMethodField()
    completed_acts_count = serializers.SerializerMethodField()
    has_completed = serializers.SerializerMethodField()
    user_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = RandomActOfKindness
        fields = [
            'id', 'group', 'title', 'description', 'target_user', 'target_user_username',
            'is_group_wide', 'points_reward', 'created_by', 'created_by_username',
            'is_active', 'created_at', 'completed_acts_count', 'has_completed', 'user_completion'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at',
                           'completed_acts_count', 'has_completed', 'user_completion']
    
    def get_created_by_username(self, obj):
        try:
            membership = GroupMembership.objects.get(user=obj.created_by, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.created_by.username
    
    def get_target_user_username(self, obj):
        if not obj.target_user:
            return None
        try:
            membership = GroupMembership.objects.get(user=obj.target_user, group=obj.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.target_user.username
    
    def get_completed_acts_count(self, obj):
        return obj.completed_acts.count()
    
    def get_has_completed(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return False
        return obj.completed_acts.filter(from_user=user).exists()
    
    def get_user_completion(self, obj):
        user = self.context.get('request').user if self.context.get('request') else None
        if not user or not user.is_authenticated:
            return None
        try:
            completion = obj.completed_acts.get(from_user=user)
            return KindnessActSerializer(completion).data
        except KindnessAct.DoesNotExist:
            return None

class KindnessActSerializer(serializers.ModelSerializer):
    from_user_username = serializers.SerializerMethodField()
    to_user_username = serializers.SerializerMethodField()
    kindness_act_title = serializers.CharField(source='kindness_act.title', read_only=True)
    
    class Meta:
        model = KindnessAct
        fields = [
            'id', 'kindness_act', 'kindness_act_title', 'from_user', 'from_user_username',
            'to_user', 'to_user_username', 'description', 'is_anonymous', 'points_earned', 'completed_at'
        ]
        read_only_fields = ['id', 'kindness_act_title', 'from_user_username', 'to_user_username',
                           'points_earned', 'completed_at']
    
    def get_from_user_username(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        try:
            membership = GroupMembership.objects.get(user=obj.from_user, group=obj.kindness_act.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.from_user.username
    
    def get_to_user_username(self, obj):
        if not obj.to_user:
            return "Entire Group"
        try:
            membership = GroupMembership.objects.get(user=obj.to_user, group=obj.kindness_act.group)
            return membership.username
        except GroupMembership.DoesNotExist:
            return obj.to_user.username 