import { ArgsOf, Client } from 'discordx'

import { On, OnCustom, Discord } from '@/decorators'
import { EventManager } from '@/services'

@Discord()
export default class PresenceUpdatedEvent {

    constructor(
        private eventManager: EventManager
    ) {}

    @On('presenceUpdated')
    async presenceUpdatedHandler(
        [arg]: ArgsOf<'presenceUpdated'>,
        client: Client
    ) {
       console.log('presenceUpdated event triggered!')
    }

    
}