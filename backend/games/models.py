from django.db import models
from django.utils import timezone
from users.models import User, Group, GroupMembership
from posts.models import Post
from events.models import Event

class Challenge(models.Model):
    CHALLENGE_TYPES = [
        ('daily', 'Daily Challenge'),
        ('weekly', 'Weekly Challenge'),
        ('monthly', 'Monthly Challenge'),
        ('special', 'Special Event'),
    ]
    
    CHALLENGE_CATEGORIES = [
        ('post', 'Posting'),
        ('event', 'Event Planning'),
        ('interaction', 'Social Interaction'),
        ('media', 'Media Sharing'),
        ('engagement', 'Engagement'),
    ]
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='challenges')
    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(max_length=20, choices=CHALLENGE_TYPES)
    category = models.CharField(max_length=20, choices=CHALLENGE_CATEGORIES)
    target_count = models.IntegerField(default=1, help_text="Number of times to complete the challenge")
    points_reward = models.IntegerField(default=10, help_text="Points awarded for completion")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_challenges')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.title} - {self.group.name}"
    
    @property
    def is_current(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.is_active
    
    @property
    def days_remaining(self):
        if not self.is_current:
            return 0
        return (self.end_date - timezone.now()).days

class ChallengeProgress(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='progress')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenge_progress')
    current_count = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('challenge', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.challenge.title}"
    
    def update_progress(self, count=1):
        self.current_count += count
        if self.current_count >= self.challenge.target_count and not self.is_completed:
            self.is_completed = True
            self.completed_at = timezone.now()
        self.save()

class Streak(models.Model):
    STREAK_TYPES = [
        ('post', 'Posting Streak'),
        ('event', 'Event Creation Streak'),
        ('comment', 'Commenting Streak'),
        ('reaction', 'Reaction Streak'),
        ('login', 'Login Streak'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='streaks')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='streaks')
    streak_type = models.CharField(max_length=20, choices=STREAK_TYPES)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'group', 'streak_type')
    
    def __str__(self):
        return f"{self.user.username} - {self.streak_type} ({self.current_streak} days)"
    
    def update_streak(self):
        today = timezone.now().date()
        last_activity_date = self.last_activity.date()
        
        if today == last_activity_date:
            # Already updated today
            return
        
        if today - last_activity_date == timezone.timedelta(days=1):
            # Consecutive day
            self.current_streak += 1
        elif today - last_activity_date > timezone.timedelta(days=1):
            # Streak broken
            self.current_streak = 1
        
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.last_activity = timezone.now()
        self.save()

class Leaderboard(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='leaderboards')
    period = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    ])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('group', 'period', 'start_date')
    
    def __str__(self):
        return f"{self.group.name} - {self.period} Leaderboard"

class LeaderboardEntry(models.Model):
    leaderboard = models.ForeignKey(Leaderboard, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    username = models.CharField(max_length=150)  # Group-specific username
    points = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    posts_count = models.IntegerField(default=0)
    events_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    reactions_count = models.IntegerField(default=0)
    challenges_completed = models.IntegerField(default=0)
    streaks_maintained = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('leaderboard', 'user')
        ordering = ['-points', '-rank']
    
    def __str__(self):
        return f"{self.username} - {self.points} points (Rank {self.rank})"
    
    def calculate_points(self):
        """Calculate total points based on various activities"""
        self.points = (
            self.posts_count * 5 +
            self.events_count * 10 +
            self.comments_count * 2 +
            self.reactions_count * 1 +
            self.challenges_completed * 20 +
            self.streaks_maintained * 15
        )
        self.save()

class Poll(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='polls')
    question = models.CharField(max_length=300)
    is_active = models.BooleanField(default=True)
    allow_multiple = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_polls')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Poll: {self.question} ({self.group.name})"

class PollOption(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Option: {self.text} (Poll: {self.poll.question})"

class PollVote(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='votes')
    option = models.ForeignKey(PollOption, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='poll_votes')
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poll', 'user', 'option')

    def __str__(self):
        return f"{self.user.username} voted for '{self.option.text}' in '{self.poll.question}'"

class Achievement(models.Model):
    BADGE = 'badge'
    MILESTONE = 'milestone'
    ROLE = 'role'
    GROUP = 'group'
    ACHIEVEMENT_TYPES = [
        (BADGE, 'Badge'),
        (MILESTONE, 'Milestone'),
        (ROLE, 'Special Role'),
        (GROUP, 'Group Achievement'),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=200, blank=True, help_text='Icon name or URL')
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES, default=BADGE)
    criteria = models.JSONField(blank=True, null=True, help_text='Criteria for awarding (e.g., {"posts": 50})')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.achievement_type})"

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='user_achievements')
    awarded_at = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='user_achievements', blank=True, null=True)
    is_group = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'achievement', 'group')

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

# Social Icebreakers Models
class TwoTruthsAndLie(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='two_truths_lie_games')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='two_truths_lie_games')
    statement1 = models.CharField(max_length=300)
    statement2 = models.CharField(max_length=300)
    statement3 = models.CharField(max_length=300)
    lie_statement = models.IntegerField(choices=[(1, 'Statement 1'), (2, 'Statement 2'), (3, 'Statement 3')])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - Two Truths and a Lie"

class TwoTruthsAndLieGuess(models.Model):
    game = models.ForeignKey(TwoTruthsAndLie, on_delete=models.CASCADE, related_name='guesses')
    guesser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='two_truths_lie_guesses')
    guessed_lie = models.IntegerField(choices=[(1, 'Statement 1'), (2, 'Statement 2'), (3, 'Statement 3')])
    is_correct = models.BooleanField()
    guessed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('game', 'guesser')
    
    def __str__(self):
        return f"{self.guesser.username} guessed {self.guessed_lie} for {self.game.user.username}"

class WouldYouRather(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='would_you_rather_polls')
    question = models.CharField(max_length=300)
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_would_you_rather')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Would you rather: {self.question}"

class WouldYouRatherVote(models.Model):
    poll = models.ForeignKey(WouldYouRather, on_delete=models.CASCADE, related_name='votes')
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='would_you_rather_votes')
    choice = models.CharField(max_length=1, choices=[('A', 'Option A'), ('B', 'Option B')])
    voted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('poll', 'voter')
    
    def __str__(self):
        return f"{self.voter.username} chose {self.choice} for {self.poll.question}"

class ThisOrThat(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='this_or_that_polls')
    question = models.CharField(max_length=300)
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_this_or_that')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"This or That: {self.question}"

class ThisOrThatVote(models.Model):
    poll = models.ForeignKey(ThisOrThat, on_delete=models.CASCADE, related_name='votes')
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='this_or_that_votes')
    choice = models.CharField(max_length=1, choices=[('A', 'Option A'), ('B', 'Option B')])
    voted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('poll', 'voter')
    
    def __str__(self):
        return f"{self.voter.username} chose {self.choice} for {self.poll.question}"

class FillInTheBlank(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='fill_in_blank_games')
    template = models.CharField(max_length=300, help_text="Use {blank} to indicate where the blank should be")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_fill_in_blank')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Fill in the blank: {self.template}"

class FillInTheBlankResponse(models.Model):
    game = models.ForeignKey(FillInTheBlank, on_delete=models.CASCADE, related_name='responses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fill_in_blank_responses')
    filled_text = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('game', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.filled_text}"

# Engagement Games Models
class SpotTheDifference(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='spot_difference_games')
    original_image = models.URLField(help_text="Original image URL")
    modified_image = models.URLField(help_text="Modified image URL with differences")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ], default='medium')
    differences_count = models.IntegerField(default=5)
    time_limit = models.IntegerField(default=60, help_text="Time limit in seconds")
    points_reward = models.IntegerField(default=10)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_spot_difference')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Spot the Difference: {self.title} ({self.group.name})"

class SpotTheDifferenceAttempt(models.Model):
    game = models.ForeignKey(SpotTheDifference, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='spot_difference_attempts')
    differences_found = models.IntegerField(default=0)
    time_taken = models.IntegerField(help_text="Time taken in seconds")
    is_completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    attempted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('game', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.game.title} ({self.differences_found}/{self.game.differences_count})"

class GuessWho(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='guess_who_games')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    photo_url = models.URLField(help_text="Childhood or mystery photo URL")
    correct_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guess_who_photos')
    hint = models.CharField(max_length=300, blank=True)
    points_reward = models.IntegerField(default=15)
    time_limit = models.IntegerField(default=300, help_text="Time limit in seconds")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_guess_who')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Guess Who: {self.title} ({self.group.name})"

class GuessWhoAttempt(models.Model):
    game = models.ForeignKey(GuessWho, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guess_who_attempts')
    guessed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guess_who_guesses')
    is_correct = models.BooleanField()
    time_taken = models.IntegerField(help_text="Time taken in seconds")
    attempted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('game', 'user')
    
    def __str__(self):
        return f"{self.user.username} guessed {self.guessed_user.username} ({'Correct' if self.is_correct else 'Incorrect'})"

class WordCloud(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='word_clouds')
    period = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    word_data = models.JSONField(help_text="Dictionary of words and their frequencies")
    total_words = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'period', 'start_date')
    
    def __str__(self):
        return f"Word Cloud: {self.group.name} - {self.period} ({self.start_date.date()})"

class ReactionRace(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='reaction_races')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reaction_races')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_reaction_type = models.CharField(max_length=50, help_text="Type of reaction to race for")
    time_limit = models.IntegerField(default=300, help_text="Time limit in seconds")
    points_reward = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_reaction_races')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Reaction Race: {self.title} ({self.group.name})"

class ReactionRaceParticipant(models.Model):
    race = models.ForeignKey(ReactionRace, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reaction_race_participations')
    reaction_time = models.IntegerField(help_text="Time taken to react in seconds")
    position = models.IntegerField(help_text="Position in the race (1st, 2nd, etc.)")
    points_earned = models.IntegerField(default=0)
    participated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('race', 'user')
        ordering = ['position']
    
    def __str__(self):
        return f"{self.user.username} - {self.race.title} (Position: {self.position})"

# Seasonal & Special Events Models
class BirthdayCelebration(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='birthday_celebrations')
    birthday_person = models.ForeignKey(User, on_delete=models.CASCADE, related_name='birthday_celebrations')
    birthday_date = models.DateField()
    celebration_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'birthday_person', 'celebration_date')
    
    def __str__(self):
        return f"Birthday Celebration: {self.birthday_person.username} ({self.celebration_date})"

class BirthdayWish(models.Model):
    celebration = models.ForeignKey(BirthdayCelebration, on_delete=models.CASCADE, related_name='wishes')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_birthday_wishes')
    message = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('celebration', 'from_user')
    
    def __str__(self):
        return f"Birthday Wish from {self.from_user.username} to {self.celebration.birthday_person.username}"

class AnniversaryCelebration(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='anniversary_celebrations')
    title = models.CharField(max_length=200)
    description = models.TextField()
    anniversary_date = models.DateField()
    celebration_date = models.DateField()
    anniversary_type = models.CharField(max_length=50, choices=[
        ('group_creation', 'Group Creation'),
        ('first_post', 'First Post'),
        ('member_milestone', 'Member Milestone'),
        ('custom', 'Custom Anniversary'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Anniversary: {self.title} ({self.celebration_date})"

class AnniversaryMessage(models.Model):
    celebration = models.ForeignKey(AnniversaryCelebration, on_delete=models.CASCADE, related_name='messages')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_anniversary_messages')
    message = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Anniversary Message from {self.from_user.username}"

class HolidayGame(models.Model):
    HOLIDAY_TYPES = [
        ('christmas', 'Christmas'),
        ('halloween', 'Halloween'),
        ('valentines', 'Valentine\'s Day'),
        ('easter', 'Easter'),
        ('thanksgiving', 'Thanksgiving'),
        ('new_year', 'New Year'),
        ('custom', 'Custom Holiday'),
    ]
    
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='holiday_games')
    holiday_type = models.CharField(max_length=20, choices=HOLIDAY_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    game_type = models.CharField(max_length=50, choices=[
        ('gift_exchange', 'Gift Exchange'),
        ('costume_contest', 'Costume Contest'),
        ('scavenger_hunt', 'Scavenger Hunt'),
        ('trivia', 'Holiday Trivia'),
        ('photo_contest', 'Photo Contest'),
        ('custom', 'Custom Game'),
    ])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    points_reward = models.IntegerField(default=20)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_holiday_games')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Holiday Game: {self.title} ({self.holiday_type})"

class HolidayGameParticipant(models.Model):
    game = models.ForeignKey(HolidayGame, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='holiday_game_participations')
    participation_date = models.DateTimeField(auto_now_add=True)
    points_earned = models.IntegerField(default=0)
    is_winner = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('game', 'user')
    
    def __str__(self):
        return f"{self.user.username} - {self.game.title}"

class RandomActOfKindness(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='random_acts_of_kindness')
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='targeted_kindness_acts', null=True, blank=True)
    is_group_wide = models.BooleanField(default=False, help_text="If True, act applies to entire group")
    points_reward = models.IntegerField(default=15)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_kindness_acts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Random Act of Kindness: {self.title}"

class KindnessAct(models.Model):
    kindness_act = models.ForeignKey(RandomActOfKindness, on_delete=models.CASCADE, related_name='completed_acts')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_kindness_acts')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_kindness_acts', null=True, blank=True)
    description = models.TextField(help_text="Description of the kind act performed")
    is_anonymous = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('kindness_act', 'from_user')
    
    def __str__(self):
        return f"Kindness Act: {self.from_user.username} -> {self.to_user.username if self.to_user else 'Group'}"
