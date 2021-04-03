from channels.generic.websocket import AsyncWebsocketConsumer


class ReceptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add('reception', self.channel_name)
        await self.accept()

    async def disconnect(self, message):
        await self.channel_layer.group_discard('reception', self.channel_name)
