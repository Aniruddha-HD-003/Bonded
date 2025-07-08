from django.urls import path
from . import views
from .views import (
    AchievementListView, UserAchievementListView, UserAchievementCreateView, 
    PhotoMemoryGameView, word_association_game, TwoTruthsAndLieListCreateView, 
    TwoTruthsAndLieDetailView, guess_two_truths_lie, WouldYouRatherListCreateView, 
    WouldYouRatherDetailView, vote_would_you_rather, ThisOrThatListCreateView, 
    ThisOrThatDetailView, vote_this_or_that, FillInTheBlankListCreateView, 
    FillInTheBlankDetailView, submit_fill_in_blank, fill_in_blank_responses
)

urlpatterns = [
    # Challenge endpoints
    path('challenges/', views.ChallengeListCreateView.as_view(), name='challenge-list-create'),
    path('challenges/<int:pk>/', views.ChallengeDetailView.as_view(), name='challenge-detail'),
    path('challenge-progress/', views.ChallengeProgressView.as_view(), name='challenge-progress'),
    
    # Streak endpoints
    path('streaks/', views.StreakListView.as_view(), name='streak-list'),
    path('streaks/update/', views.update_streak, name='update-streak'),
    path('streaks/auto-update/', views.auto_update_streaks, name='auto-update-streaks'),
    
    # Leaderboard endpoints
    path('leaderboards/', views.LeaderboardListView.as_view(), name='leaderboard-list'),
    path('leaderboard-entries/', views.LeaderboardEntryListView.as_view(), name='leaderboard-entry-list'),
    path('leaderboards/calculate/', views.calculate_leaderboard, name='calculate-leaderboard'),
    
    # User statistics
    path('user-stats/', views.user_stats, name='user-stats'),
    
    # Poll endpoints
    path('polls/', views.PollListCreateView.as_view(), name='poll-list-create'),
    path('polls/<int:pk>/', views.PollDetailView.as_view(), name='poll-detail'),
    path('polls/<int:poll_id>/vote/', views.vote_poll, name='poll-vote'),
    
    # Achievement endpoints
    path('achievements/', AchievementListView.as_view(), name='achievement-list'),
    path('user-achievements/', UserAchievementListView.as_view(), name='user-achievement-list'),
    path('user-achievements/create/', UserAchievementCreateView.as_view(), name='user-achievement-create'),
    
    # Photo Memory Game endpoint
    path('photo-memory/', PhotoMemoryGameView.as_view(), name='photo-memory-game'),
    
    # Word Association Game endpoint
    path('word-association/', word_association_game, name='word-association-game'),
    
    # Social Icebreakers endpoints
    # Two Truths and a Lie
    path('two-truths-lie/', TwoTruthsAndLieListCreateView.as_view(), name='two-truths-lie-list-create'),
    path('two-truths-lie/<int:pk>/', TwoTruthsAndLieDetailView.as_view(), name='two-truths-lie-detail'),
    path('two-truths-lie/<int:game_id>/guess/', guess_two_truths_lie, name='two-truths-lie-guess'),
    
    # Would You Rather
    path('would-you-rather/', WouldYouRatherListCreateView.as_view(), name='would-you-rather-list-create'),
    path('would-you-rather/<int:pk>/', WouldYouRatherDetailView.as_view(), name='would-you-rather-detail'),
    path('would-you-rather/<int:poll_id>/vote/', vote_would_you_rather, name='would-you-rather-vote'),
    
    # This or That
    path('this-or-that/', ThisOrThatListCreateView.as_view(), name='this-or-that-list-create'),
    path('this-or-that/<int:pk>/', ThisOrThatDetailView.as_view(), name='this-or-that-detail'),
    path('this-or-that/<int:poll_id>/vote/', vote_this_or_that, name='this-or-that-vote'),
    
    # Fill in the Blank
    path('fill-in-blank/', FillInTheBlankListCreateView.as_view(), name='fill-in-blank-list-create'),
    path('fill-in-blank/<int:pk>/', FillInTheBlankDetailView.as_view(), name='fill-in-blank-detail'),
    path('fill-in-blank/<int:game_id>/submit/', submit_fill_in_blank, name='fill-in-blank-submit'),
    path('fill-in-blank/<int:game_id>/responses/', fill_in_blank_responses, name='fill-in-blank-responses'),
] 