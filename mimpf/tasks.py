from .models import QueueEntry


def update_pending_priorities():

    for query_entry in QueueEntry.objects.all():
        priority = query_entry.get_priority()
