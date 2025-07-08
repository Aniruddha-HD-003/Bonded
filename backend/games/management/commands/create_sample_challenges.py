from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from games.models import Challenge
from users.models import Group, User

class Command(BaseCommand):
    help = 'Create sample challenges for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--group-name',
            type=str,
            help='Create challenges for a specific group',
        )
        parser.add_argument(
            '--all-groups',
            action='store_true',
            help='Create challenges for all groups',
        )

    def handle(self, *args, **options):
        if options['all_groups']:
            groups = Group.objects.all()
        elif options['group_name']:
            try:
                groups = [Group.objects.get(name=options['group_name'])]
            except Group.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Group "{options["group_name"]}" not found')
                )
                return
        else:
            self.stdout.write(
                self.style.ERROR('Please specify --group-name or --all-groups')
            )
            return

        # Get a user for creating challenges (first user in the system)
        try:
            creator = User.objects.first()
            if not creator:
                self.stdout.write(
                    self.style.ERROR('No users found in the system')
                )
                return
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('No users found in the system')
            )
            return

        challenges_created = 0
        
        for group in groups:
            self.stdout.write(f'Creating challenges for group: {group.name}')
            
            # Daily Challenges
            daily_challenges = [
                {
                    'title': 'Daily Post Challenge',
                    'description': 'Share a post with your group today!',
                    'challenge_type': 'daily',
                    'category': 'post',
                    'target_count': 1,
                    'points_reward': 10,
                },
                {
                    'title': 'Daily Interaction Challenge',
                    'description': 'Comment on at least one post today',
                    'challenge_type': 'daily',
                    'category': 'interaction',
                    'target_count': 1,
                    'points_reward': 5,
                },
                {
                    'title': 'Daily Reaction Challenge',
                    'description': 'React to at least 3 posts today',
                    'challenge_type': 'daily',
                    'category': 'engagement',
                    'target_count': 3,
                    'points_reward': 8,
                },
            ]

            # Weekly Challenges
            weekly_challenges = [
                {
                    'title': 'Weekly Content Creator',
                    'description': 'Create 5 posts this week',
                    'challenge_type': 'weekly',
                    'category': 'post',
                    'target_count': 5,
                    'points_reward': 25,
                },
                {
                    'title': 'Weekly Event Planner',
                    'description': 'Create an event for your group this week',
                    'challenge_type': 'weekly',
                    'category': 'event',
                    'target_count': 1,
                    'points_reward': 20,
                },
                {
                    'title': 'Weekly Social Butterfly',
                    'description': 'Comment on 10 different posts this week',
                    'challenge_type': 'weekly',
                    'category': 'interaction',
                    'target_count': 10,
                    'points_reward': 15,
                },
            ]

            # Monthly Challenges
            monthly_challenges = [
                {
                    'title': 'Monthly Media Master',
                    'description': 'Share 10 posts with media (photos/videos) this month',
                    'challenge_type': 'monthly',
                    'category': 'media',
                    'target_count': 10,
                    'points_reward': 50,
                },
                {
                    'title': 'Monthly Engagement King',
                    'description': 'React to 50 posts this month',
                    'challenge_type': 'monthly',
                    'category': 'engagement',
                    'target_count': 50,
                    'points_reward': 30,
                },
            ]

            # Special Event Challenges
            special_challenges = [
                {
                    'title': 'Group Memory Maker',
                    'description': 'Share your favorite group memory with a photo',
                    'challenge_type': 'special',
                    'category': 'media',
                    'target_count': 1,
                    'points_reward': 15,
                },
                {
                    'title': 'Group Bonding Event',
                    'description': 'Organize a virtual or in-person meetup',
                    'challenge_type': 'special',
                    'category': 'event',
                    'target_count': 1,
                    'points_reward': 25,
                },
            ]

            all_challenges = daily_challenges + weekly_challenges + monthly_challenges + special_challenges

            for challenge_data in all_challenges:
                # Set appropriate start and end dates based on challenge type
                now = timezone.now()
                if challenge_data['challenge_type'] == 'daily':
                    start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
                    end_date = start_date + timedelta(days=1)
                elif challenge_data['challenge_type'] == 'weekly':
                    start_date = now - timedelta(days=now.weekday())
                    start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                    end_date = start_date + timedelta(days=7)
                elif challenge_data['challenge_type'] == 'monthly':
                    start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    if now.month == 12:
                        end_date = now.replace(year=now.year + 1, month=1, day=1)
                    else:
                        end_date = now.replace(month=now.month + 1, day=1)
                else:  # special
                    start_date = now
                    end_date = now + timedelta(days=30)

                challenge, created = Challenge.objects.get_or_create(
                    group=group,
                    title=challenge_data['title'],
                    defaults={
                        'description': challenge_data['description'],
                        'challenge_type': challenge_data['challenge_type'],
                        'category': challenge_data['category'],
                        'target_count': challenge_data['target_count'],
                        'points_reward': challenge_data['points_reward'],
                        'start_date': start_date,
                        'end_date': end_date,
                        'created_by': creator,
                        'is_active': True,
                    }
                )
                
                if created:
                    challenges_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created challenge: {challenge.title}')
                    )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {challenges_created} challenges!')
        ) 