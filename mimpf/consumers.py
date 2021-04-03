from djangochannelsrestframework.permissions import IsAuthenticated
from . import serializers
from .models import (
    QueueEntry,
    Appointment,
    Pager
)
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import (
    ListModelMixin,
    PatchModelMixin,
    UpdateModelMixin,
    CreateModelMixin,
    DeleteModelMixin,
    RetrieveModelMixin,
)


class AppointmentConsumer(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    PatchModelMixin,
    UpdateModelMixin,
    DeleteModelMixin,
    GenericAsyncAPIConsumer
):
    queryset = Appointment.objects.all()
    serializer_class = serializers.AppointmentSerializer
    permission_classes = (IsAuthenticated,)


class QueueEntryConsumer(
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    PatchModelMixin,
    UpdateModelMixin,
    DeleteModelMixin,
    GenericAsyncAPIConsumer
):
    queryset = QueueEntry.objects.all()
    serializer_class = serializers.QueueEntrySerializer
    permission_classes = (IsAuthenticated,)
