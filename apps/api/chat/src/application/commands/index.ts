import { CreateRoomHandler } from './create-room.handler'
import { JoinRoomHandler } from './join-room.handler'
import { SendMessageHandler } from './send-message.handler'

export const commandHandlers = [SendMessageHandler, CreateRoomHandler, JoinRoomHandler]
