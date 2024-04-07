"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var discord_js_1 = require("discord.js");
// Create a new client instance
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildPresences,
    ],
});
// When the client is ready, run this code (only once).
client.once(discord_js_1.Events.ClientReady, function (readyClient) {
    console.log("Ready! Logged in as ".concat(readyClient.user.tag));
    client.guilds.cache.forEach(function (guild) {
        updateAllPlayers(guild);
    });
});
// When added to a guild, run this code (only once).
client.on(discord_js_1.Events.GuildCreate, function (guild) {
    console.log("Joined ".concat(guild.name));
    if (guild) {
        updateAllPlayers(guild);
    }
    else {
        console.log("Guild not found.");
    }
});
function updateAllPlayers(guild) {
    console.log("Updating all players for guild: " + guild.name);
    guild.members.cache.forEach(function (member) {
        if (!member.user.bot) {
            updateRole(member);
        }
    });
}
function updateRole(member) {
    var presence = member.presence;
    if (presence) {
        if (presence.activities.length > 0) {
            var game_1 = presence.activities.find(function (activity) { return activity.type === discord_js_1.ActivityType.Playing; });
            if (game_1) {
                console.log("".concat(member.displayName, " is playing ").concat(game_1.name));
                // Lookup role
                var role_1 = member.guild.roles.cache.find(function (role) { return role.name === game_1.name; });
                if (!role_1) {
                    var options = {
                        name: game_1.name,
                        color: discord_js_1.Colors.Blue,
                        mentionable: false,
                    };
                    member.guild.roles.create(options)
                        .then(function (newRole) {
                        role_1 = newRole;
                        console.log("Created role ".concat(role_1.name));
                    });
                }
                // Assign role
                member.roles.add(role_1).then(function () {
                    console.log("Assigned role ".concat(role_1.name, " to ").concat(member.displayName));
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
