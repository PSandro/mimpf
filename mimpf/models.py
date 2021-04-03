import datetime

from django.db import models
from django.utils.timezone import get_current_timezone
from django.utils.translation import gettext_lazy as _

from .queue import waiting_time_priority, target_date_priority, punctuality_priority, weight_priorities


class Pager(models.Model):
    def __str__(self):
        return str(self.label)

    enabled = models.BooleanField(default=True)
    label = models.DecimalField(max_digits=10, decimal_places=0)


class QueueEntry(models.Model):
    def __str__(self):
        return str(self.pager) + ': ' + str(self.registration_time)

    pager = models.ForeignKey(
        Pager,
        on_delete=models.PROTECT
    )
    registration_time = models.DateTimeField(blank=True, null=False)
    called_time = models.DateTimeField(blank=True, null=True)

    @property
    def priority(self):
        time = datetime.datetime.now(tz=get_current_timezone())
        waiting_diff = (time - self.registration_time).total_seconds() / 60.0
        waiting_prio = waiting_time_priority(waiting_diff)

        target_prios = []
        punctuality_prios = []
        for appointment in self.appointment_set.all():
            target_diff = (time - appointment.datetime).total_seconds() / 60.0
            target_prio = target_date_priority(target_diff)
            target_prios.append(target_prio)

            arrival_diff = (appointment.datetime - self.registration_time).total_seconds() / 60.0
            punctuality_prio = punctuality_priority(arrival_diff)
            punctuality_prios.append(punctuality_prio)

        # get the lowes target_diff => lower = better
        target_prio = min(target_prios)
        punctuality_prio = min(punctuality_prios)

        return weight_priorities(waiting_prio, target_prio, punctuality_prio)


class Appointment(models.Model):
    def __str__(self):
        return str(self.datetime) + ': ' + str(self.last_name) + ', ' + str(self.first_name)

    class Stage(models.TextChoices):
        PENDING = 'PD', _('pending')
        ENQUEUED = 'EQ', _('enqueued')
        COMPLETED = 'CP', _('completed')

    datetime = models.DateTimeField()
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    vaccine = models.CharField(max_length=100)
    stage = models.CharField(
        max_length=2,
        choices=Stage.choices,
        default=Stage.PENDING
    )
    queue_entity = models.ForeignKey(
        QueueEntry,
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
