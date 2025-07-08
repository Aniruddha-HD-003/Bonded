from django.contrib import admin
from .models import Challenge, ChallengeProgress, Streak, Leaderboard, LeaderboardEntry, Poll, PollOption, PollVote, Achievement, UserAchievement

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'group', 'challenge_type', 'category', 'is_active', 'is_current', 'days_remaining', 'created_by']
    list_filter = ['challenge_type', 'category', 'is_active', 'group']
    search_fields = ['title', 'description', 'group__name']
    readonly_fields = ['is_current', 'days_remaining']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('group', 'title', 'description', 'challenge_type', 'category')
        }),
        ('Challenge Details', {
            'fields': ('target_count', 'points_reward', 'start_date', 'end_date', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'is_current', 'days_remaining'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ChallengeProgress)
class ChallengeProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge', 'current_count', 'is_completed', 'progress_percentage', 'last_activity']
    list_filter = ['is_completed', 'challenge__challenge_type', 'challenge__group']
    search_fields = ['user__username', 'challenge__title']
    readonly_fields = ['progress_percentage']
    date_hierarchy = 'last_activity'
    
    def progress_percentage(self, obj):
        if obj.challenge.target_count == 0:
            return 0
        return min(100, round((obj.current_count / obj.challenge.target_count) * 100, 1))
    progress_percentage.short_description = 'Progress %'

@admin.register(Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ['user', 'group', 'streak_type', 'current_streak', 'longest_streak', 'is_active', 'last_activity']
    list_filter = ['streak_type', 'is_active', 'group']
    search_fields = ['user__username', 'group__name']
    date_hierarchy = 'last_activity'
    
    fieldsets = (
        ('Streak Information', {
            'fields': ('user', 'group', 'streak_type', 'current_streak', 'longest_streak')
        }),
        ('Status', {
            'fields': ('is_active', 'last_activity')
        }),
    )

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['group', 'period', 'start_date', 'end_date', 'is_active', 'entry_count']
    list_filter = ['period', 'is_active', 'group']
    search_fields = ['group__name']
    date_hierarchy = 'start_date'
    readonly_fields = ['entry_count']
    
    def entry_count(self, obj):
        return obj.entries.count()
    entry_count.short_description = 'Entries'

@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ['username', 'leaderboard', 'points', 'rank', 'posts_count', 'events_count', 'challenges_completed']
    list_filter = ['leaderboard__period', 'leaderboard__group']
    search_fields = ['username', 'leaderboard__group__name']
    readonly_fields = ['points', 'rank']
    
    fieldsets = (
        ('Entry Information', {
            'fields': ('leaderboard', 'user', 'username', 'rank')
        }),
        ('Activity Counts', {
            'fields': ('posts_count', 'events_count', 'comments_count', 'reactions_count')
        }),
        ('Game Achievements', {
            'fields': ('challenges_completed', 'streaks_maintained')
        }),
        ('Points', {
            'fields': ('points',),
            'classes': ('collapse',)
        }),
    )

class PollOptionInline(admin.TabularInline):
    model = PollOption
    extra = 1

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ['question', 'group', 'is_active', 'created_by', 'created_at']
    list_filter = ['group', 'is_active']
    search_fields = ['question', 'group__name']
    inlines = [PollOptionInline]
    date_hierarchy = 'created_at'

@admin.register(PollVote)
class PollVoteAdmin(admin.ModelAdmin):
    list_display = ['poll', 'option', 'user', 'voted_at']
    list_filter = ['poll', 'option', 'user']
    search_fields = ['poll__question', 'option__text', 'user__username']

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'achievement_type', 'is_active', 'created_at']
    list_filter = ['achievement_type', 'is_active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']

@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ['user', 'achievement', 'awarded_at', 'group', 'is_group']
    list_filter = ['achievement__achievement_type', 'is_group', 'group']
    search_fields = ['user__username', 'achievement__name']
    readonly_fields = ['awarded_at']
