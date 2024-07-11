import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Client } from 'discordx'

import { generalConfig } from '@/configs'
import { Discord, Injectable, Slash, SlashOption } from '@/decorators'
import { Guild } from '@/entities'
import { UnknownReplyError } from '@/errors'
import { Guard, UserPermissions } from '@/guards'
import { Database } from '@/services'
import { resolveGuild, simpleSuccessEmbed } from '@/utils/functions'

@Discord()
@Injectable()
@Category('Admin')
export default class CreateRolesCommand {

	constructor(
		private db: Database
	) {}

	@Slash({ name: 'create-roles' })
	@Guard(
		UserPermissions(['Administrator'])
	)
	async createRoles(
		@SlashOption({
			name: 'create',
			description: 'Create roles automatically when a user starts playing a game',
			type: ApplicationCommandOptionType.Boolean,
			required: true
		}) create_roles: boolean | undefined,
			interaction: CommandInteraction,
			client: Client,
			{ localize }: InteractionData
	) {
		const guild = resolveGuild(interaction)
		const guildData = await this.db.get(Guild).findOne({ id: guild?.id || '' })

		if (guildData) {
			guildData.create_roles = create_roles || false
			await this.db.get(Guild).persistAndFlush(guildData)

			const message = (guildData.create_roles ? 'Roles will now be created automatically when a user starts playing a game.' : 'Roles will no longer be created automatically when a user starts playing a game.');

			simpleSuccessEmbed(
				interaction,
				message
			)
		} else {
			throw new UnknownReplyError(interaction)
		}
	}

}
