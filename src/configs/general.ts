import { env } from '@/env'

export const generalConfig: GeneralConfigType = {

	name: 'AutoGameBot', // the name of your bot
	description: '', // the description of your bot
	defaultLocale: 'en', // default language of the bot, must be a valid locale
	ownerId: env.BOT_OWNER_ID,
	timezone: 'America/Phoenix', // default TimeZone to well format and localize dates (logs, stats, etc)

	simpleCommandsPrefix: '!', // default prefix for simple command messages (old way to do commands on discord)
	automaticDeferring: true, // enable or not the automatic deferring of the replies of the bot on the command interactions

	// useful links
	links: {
		invite: 'https://discord.com/oauth2/authorize?client_id=1226597721675399290\n',
		supportServer: 'https://discord.com/your_invitation_link',
		gitRemoteRepo: 'https://github.com/brianclogan/game-role-discord-bot',
	},

	automaticUploadImagesToImgur: false, // enable or not the automatic assets upload

	devs: [], // discord IDs of the devs that are working on the bot (you don't have to put the owner's id here)

	// define the bot activities (phrases under its name). Types can be: PLAYING, LISTENING, WATCHING, STREAMING
	activities: [
		{
			text: 'match the game',
			type: 'PLAYING',
		},
		// {
		// 	text: 'some knowledge',
		// 	type: 'STREAMING',
		// },
	],

}

// global colors
export const colorsConfig = {
	primary: '#2F3136',
	secondary: '#36393F',
	success: '#43B581',
	error: '#F04747',
	warning: '#FAA61A',
	info: '#7289DA',
	neutral: '#747F8D',
}
