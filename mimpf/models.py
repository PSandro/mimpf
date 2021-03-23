from django.db import models
from django.utils.translation import gettext_lazy as _


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
