from django.core.management.base import BaseCommand
from users.models import User, Group, GroupMembership
from posts.models import Post
from events.models import Event
from comments.models import Comment
from reactions.models import Reaction


class Command(BaseCommand):
    help = 'Clean up all test data from the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--group-name',
            type=str,
            help='Clean up specific group by name (e.g., "Test Group API")',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Clean up ALL data (use with caution!)',
        )

    def handle(self, *args, **options):
        if options['all']:
            self.stdout.write('Cleaning up ALL data...')
            self.cleanup_all()
        elif options['group_name']:
            self.stdout.write(f'Cleaning up group: {options["group_name"]}')
            self.cleanup_group(options['group_name'])
        else:
            self.stdout.write('Cleaning up test groups (containing "Test Group")...')
            self.cleanup_test_groups()

    def cleanup_test_groups(self):
        """Clean up groups with 'Test Group' in the name"""
        test_groups = Group.objects.filter(name__icontains='Test Group')
        self.cleanup_groups(test_groups)

    def cleanup_group(self, group_name):
        """Clean up a specific group by name"""
        try:
            group = Group.objects.get(name=group_name)
            self.cleanup_groups([group])
        except Group.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Group "{group_name}" not found'))

    def cleanup_all(self):
        """Clean up ALL data (use with extreme caution!)"""
        # Delete in reverse order to avoid foreign key constraints
        Reaction.objects.all().delete()
        Comment.objects.all().delete()
        Event.objects.all().delete()
        Post.objects.all().delete()
        GroupMembership.objects.all().delete()
        Group.objects.all().delete()
        User.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('All data cleaned up!'))

    def cleanup_groups(self, groups):
        """Clean up specific groups and all related data"""
        if not groups:
            self.stdout.write('No groups to clean up')
            return

        group_ids = [group.id for group in groups]
        group_names = [group.name for group in groups]

        # Delete related data
        reactions_deleted = Reaction.objects.filter(post__group__in=groups).delete()[0]
        comments_deleted = Comment.objects.filter(post__group__in=groups).delete()[0]
        events_deleted = Event.objects.filter(group__in=groups).delete()[0]
        posts_deleted = Post.objects.filter(group__in=groups).delete()[0]
        
        # Get user IDs before deleting memberships
        user_ids = list(GroupMembership.objects.filter(group__in=groups).values_list('user_id', flat=True))
        
        memberships_deleted = GroupMembership.objects.filter(group__in=groups).delete()[0]
        groups_deleted = Group.objects.filter(id__in=group_ids).delete()[0]
        
        # Delete users that are no longer in any groups
        orphaned_users = User.objects.filter(memberships__isnull=True)
        users_deleted = orphaned_users.delete()[0]

        self.stdout.write(self.style.SUCCESS(
            f'Cleaned up groups: {", ".join(group_names)}\n'
            f'Deleted: {reactions_deleted} reactions, {comments_deleted} comments, '
            f'{events_deleted} events, {posts_deleted} posts, '
            f'{memberships_deleted} memberships, {groups_deleted} groups, '
            f'{users_deleted} orphaned users'
        )) 