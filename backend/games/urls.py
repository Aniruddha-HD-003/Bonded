from django.urls import path
from . import views
from .views import (
    AchievementListView, UserAchievementListView, UserAchievementCreateView, 
    PhotoMemoryGameView, word_association_game, TwoTruthsAndLieListCreateView, 
    TwoTruthsAndLieDetailView, guess_two_truths_lie, WouldYouRatherListCreateView, 
    WouldYouRatherDetailView, vote_would_you_rather, ThisOrThatListCreateView, 
    ThisOrThatDetailView, vote_this_or_that, FillInTheBlankListCreateView, 
    FillInTheBlankDetailView, submit_fill_in_blank, fill_in_blank_responses,
    SpotTheDifferenceListCreateView, SpotTheDifferenceDetailView, submit_spot_difference_attempt,
    GuessWhoListCreateView, GuessWhoDetailView, submit_guess_who_attempt,
    generate_word_cloud, ReactionRaceListCreateView, ReactionRaceDetailView,
    join_reaction_race, reaction_race_leaderboard,
    BirthdayCelebrationListCreateView, BirthdayCelebrationDetailView, send_birthday_wish, birthday_wishes,
    AnniversaryCelebrationListCreateView, AnniversaryCelebrationDetailView, send_anniversary_message, anniversary_messages,
    HolidayGameListCreateView, HolidayGameDetailView, join_holiday_game, holiday_game_participants,
    RandomActOfKindnessListCreateView, RandomActOfKindnessDetailView, complete_kindness_act, kindness_act_completions
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
    
    # Engagement Games endpoints
    # Spot the Difference
    path('spot-difference/', SpotTheDifferenceListCreateView.as_view(), name='spot-difference-list-create'),
    path('spot-difference/<int:pk>/', SpotTheDifferenceDetailView.as_view(), name='spot-difference-detail'),
    path('spot-difference/<int:game_id>/attempt/', submit_spot_difference_attempt, name='spot-difference-attempt'),
    
    # Guess Who
    path('guess-who/', GuessWhoListCreateView.as_view(), name='guess-who-list-create'),
    path('guess-who/<int:pk>/', GuessWhoDetailView.as_view(), name='guess-who-detail'),
    path('guess-who/<int:game_id>/attempt/', submit_guess_who_attempt, name='guess-who-attempt'),
    
    # Word Cloud
    path('word-cloud/<int:group_id>/', generate_word_cloud, name='generate-word-cloud'),
    
    # Reaction Race
    path('reaction-race/', ReactionRaceListCreateView.as_view(), name='reaction-race-list-create'),
    path('reaction-race/<int:pk>/', ReactionRaceDetailView.as_view(), name='reaction-race-detail'),
    path('reaction-race/<int:race_id>/join/', join_reaction_race, name='join-reaction-race'),
    path('reaction-race/<int:race_id>/leaderboard/', reaction_race_leaderboard, name='reaction-race-leaderboard'),
    
    # Seasonal & Special Events endpoints
    # Birthday Celebrations
    path('birthday-celebrations/', BirthdayCelebrationListCreateView.as_view(), name='birthday-celebration-list-create'),
    path('birthday-celebrations/<int:pk>/', BirthdayCelebrationDetailView.as_view(), name='birthday-celebration-detail'),
    path('birthday-celebrations/<int:celebration_id>/wish/', send_birthday_wish, name='send-birthday-wish'),
    path('birthday-celebrations/<int:celebration_id>/wishes/', birthday_wishes, name='birthday-wishes'),
    
    # Anniversary Celebrations
    path('anniversary-celebrations/', AnniversaryCelebrationListCreateView.as_view(), name='anniversary-celebration-list-create'),
    path('anniversary-celebrations/<int:pk>/', AnniversaryCelebrationDetailView.as_view(), name='anniversary-celebration-detail'),
    path('anniversary-celebrations/<int:celebration_id>/message/', send_anniversary_message, name='send-anniversary-message'),
    path('anniversary-celebrations/<int:celebration_id>/messages/', anniversary_messages, name='anniversary-messages'),
    
    # Holiday Games
    path('holiday-games/', HolidayGameListCreateView.as_view(), name='holiday-game-list-create'),
    path('holiday-games/<int:pk>/', HolidayGameDetailView.as_view(), name='holiday-game-detail'),
    path('holiday-games/<int:game_id>/join/', join_holiday_game, name='join-holiday-game'),
    path('holiday-games/<int:game_id>/participants/', holiday_game_participants, name='holiday-game-participants'),
    
    # Random Acts of Kindness
    path('random-acts-kindness/', RandomActOfKindnessListCreateView.as_view(), name='random-act-kindness-list-create'),
    path('random-acts-kindness/<int:pk>/', RandomActOfKindnessDetailView.as_view(), name='random-act-kindness-detail'),
    path('random-acts-kindness/<int:kindness_act_id>/complete/', complete_kindness_act, name='complete-kindness-act'),
    path('random-acts-kindness/<int:kindness_act_id>/completions/', kindness_act_completions, name='kindness-act-completions'),
] 