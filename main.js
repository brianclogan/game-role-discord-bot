require("dotenv").config();
const { Client, Events, GatewayIntentBits, ActivityType, GuildMember, Colors } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
  ],
});

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  client.guilds.cache.forEach((guild) => {
    updateAllPlayers(guild);
  });
});

// When added to a guild, run this code (only once).
client.on(Events.GuildCreate, (guild) => {
  console.log(`Joined ${guild.name}`);
  if (guild) {
    updateAllPlayers(guild);
  } else {
    console.log("Guild not found.");
  }
});

function updateAllPlayers(guild) {
  console.log("Updating all players for guild: " + guild.name);
  guild.members.cache.forEach((member) => {
    if(!member.user.bot) {
      updateRole(member);
    }
  });
}

/**
 * 
 * @param GuildMember member 
 */
function updateRole(member) {
  const presence = member.presence;
  if (presence) {
    if(presence.activities.length > 0) {
      const game = presence.activities.find(
        (activity) => activity.type === ActivityType.Playing
        );
        
      if (game) {
        console.log(`${member.displayName} is playing ${game.name}`);
        // Lookup role
        let role = member.guild.roles.cache.find(
          (role) => role.name === game.name
        );
        if (!role) {
          member.guild.roles.create()
          const roleManager = new RoleManager(member.guild);
          roleManager.create({ name: game.name, color: Colors.BL })
            .then((newRole) => {
              role = newRole;
              console.log(`Created role ${role.name}`);
            });
        }
        // Assign role
        member.roles.add(role).then(() => {
          console.log(`Assigned role ${role.name} to ${member.displayName}`);
        });
      }
    }
  }
}

// const member = newPresence.member;
// const oldGame = oldPresence.activities.find(
//   (activity) => activity.type === "PLAYING"
// );
// const newGame = newPresence.activities.find(
//   (activity) => activity.type === "PLAYING"
// );

// if (oldGame && !newGame) {
//   // User stopped playing a game
//   console.log(`${member.user.tag} stopped playing ${oldGame.name}`);
//   // Remove role logic here
// }

// if (!oldGame && newGame) {
//   // User started playing a game
//   console.log(`${member.user.tag} started playing ${newGame.name}`);
//   // Assign role logic here
// }

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login(process.env.BOT_TOKEN);
