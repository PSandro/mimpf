from rest_framework import serializers

from mimpf.models import Appointment, QueueEntry


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['datetime', 'first_name', 'last_name', 'vaccine', 'stage', 'pk']
        read_only_fields = ['datetime', 'first_name', 'last_name', 'vaccine', 'stage', 'pk']


class QueueEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = QueueEntry
        fields = ['pager', 'registration_time', 'called_time', 'priority', 'pk']
        read_only_fields = ['pager', 'registration_time', 'called_time', 'priority', 'pk']
