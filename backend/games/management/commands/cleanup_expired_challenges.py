from django.core.management.base import BaseCommand
from django.utils import timezone
from games.models import Challenge

class Command(BaseCommand):
    help = 'Delete all expired challenges (end_date < now)'

    def handle(self, *args, **options):
        now = timezone.now()
        expired = Challenge.objects.filter(end_date__lt=now)
        count = expired.count()
        expired.delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} expired challenges.')) 