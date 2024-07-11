import {ArgsOf, Client} from 'discordx'
import {Discord, On} from '@/decorators'
import {ActivityType, Colors, Presence, Role, RoleCreateOptions} from "discord.js";
import {Database, Logger} from "@/services";
import chalk from "chalk";
import {resolveDependencies} from "@/utils/functions";
import {Guild} from "discord.js";
import {Guild as GuildRepo} from "@/entities";

@Discord()
export default class PresenceUpdateEvent {
    private _oldPresence: Presence | null;
    private _newPresence: Presence;
    private logger: Logger;
    private db: Database;

    @On('presenceUpdate')
    async presenceUpdateHandler(
        [oldPresence, newPresence]: ArgsOf<'presenceUpdate'>,
        client: Client
    ) {
        [this.logger, this.db] = await resolveDependencies([Logger, Database])
        this._oldPresence = oldPresence;
        this._newPresence = newPresence;

        const activities = newPresence.activities;
        const game = activities.find(activity => activity.type === ActivityType.Playing);
        const lastGame = this._oldPresence?.activities.find(activity => activity.type === ActivityType.Playing);
        const guild = newPresence.guild;
        const member = newPresence.member;
        if (!member) {

            return;
        }

        if (game) {

            if (!lastGame) {
                this.log(
                    `${member.displayName} is playing ${game.name}`,
                    `${chalk.bold.green(member.displayName)} ${chalk.dim.italic.gray('is playing')} ${chalk.bold.blue(game.name)}`
                );
            } else {
                this.log(
                    `${member.displayName} switched to play ${game.name}`,
                    `${chalk.bold.green(member.displayName)} ${chalk.dim.italic.gray('switched to play')} ${chalk.bold.blue(game.name)}`
                );
            }
            if (guild) {
                const guildRepo = await this.db.get(GuildRepo).findOne({id: guild.id});
                if(!guildRepo) {
                    return;
                }
                let role = await this.getRole(guild, game.name);
                if (role === undefined) {
                    if (guildRepo.create_roles) {
                        console.log('CREATING A ROLE ' + guildRepo.create_roles);
                        role = await this.createRole(guild, game.name);
                    } else {
                        return;
                    }
                }
                await member.roles.add(role);
                this.log(
                    `${role.name} added to ${member.displayName} on ${guild.name}`,
                    `${chalk.bold.blue(role.name)} ${chalk.dim.italic.gray('added to')} ${chalk.bold.green(member.displayName)} ${chalk.dim.italic.gray('on')} ${chalk.bold.white(guild.name)}`
                );
                // remove the role if the user was playing a game before
                if (this._oldPresence) {
                    if (lastGame) {
                        const oldRole = guild.roles.cache.find(role => role.name === lastGame.name);
                        if (oldRole) {
                            await member.roles.remove(oldRole);
                        }
                    }
                }
            }
        } else {
            if (lastGame) {
                this.log(
                    `${member.displayName} stopped playing ${lastGame.name}`,
                    `${chalk.bold.green(member.displayName)} ${chalk.dim.italic.gray('stopped playing')} ${chalk.bold.blue(lastGame.name)}`
                );
                if (guild) {
                    const role = guild.roles.cache.find(role => role.name === lastGame.name);
                    if (role) {
                        await member.roles.remove(role);
                        this.log(
                            `${role.name} removed from ${member.displayName} on ${guild.name}`,
                            `${chalk.bold.blue(role.name)} ${chalk.dim.italic.gray('removed from')} ${chalk.bold.green(member.displayName)} ${chalk.dim.italic.gray('on')} ${chalk.bold.white(guild.name)}`
                        );
                    }
                }
            }
        }
    }

    private async getRole(guild: Guild, game: string): Promise<Role | undefined> {
        let role = guild.roles.cache.find(role => role.name === game);
        if (role) {
            this.log(
                `${guild.name} has role ${role.name}`,
                `${chalk.bold.white(guild.name)} ${chalk.dim.italic.gray('has role')} ${chalk.bold.blue(role.name)}`
            );
        }
        return role;
    }

    private async createRole(guild: Guild, game: string): Promise<Role> {
        const newRoleInformation: RoleCreateOptions = {
            name: game,
            color: Colors.Blue,
            mentionable: true,
            position: 1,
            permissions: [],
        }
        const role = await guild.roles.create(newRoleInformation);
        this.log(
            `Created new role ${role.name} on ${guild.name}`,
            `${chalk.bold.green('Created new role')} ${chalk.bold.blue(role.name)} ${chalk.dim.italic.gray('on')} ${chalk.bold.blue(guild.name)}`
        );
        return role;
    }

    private log(message: string, chalkMessage?: string) {
        this.logger.logChalk(
            `[PresenceUpdateEvent] - ${message}`,
            `[${chalk.bold.white('PresenceUpdateEvent')}] - ${chalkMessage || message}`
        );
    }


}