"""
ASGI config for mimpf project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from channelsmultiplexer import AsyncJsonWebsocketDemultiplexer
from django.core.asgi import get_asgi_application
from django.urls import re_path

from .consumers import AppointmentConsumer, QueueEntryConsumer

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mimpf.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter([
            re_path(r'^ws/$', AsyncJsonWebsocketDemultiplexer.as_asgi(
                appointment=AppointmentConsumer.as_asgi(),
                queue_entry=QueueEntryConsumer.as_asgi(),
            )),
        ])
    ),
})
