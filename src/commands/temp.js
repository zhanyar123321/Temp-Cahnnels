const ms = require("ms");
const moment = require('moment');
const { MessageEmbed, Client } = require("discord.js");
const db = require('quick.db')

module.exports = {
    name: "temp",
    aliases: ["t"],
    cooldown: 5,
    run: async(client, message) => {
        try {
            const args = message.content.split(" ");
            const time = args[3];
            const user = message.mentions.users.first() || client.users.cache.get(message.content.split(' ')[2])
            if (args[1] === "new") {
                if (!message.member.hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send(
                        new MessageEmbed()
                        .setColor("RED")
                        .setAuthor(
                            `❌ | What Are You Doing?`
                        )
                        .setDescription(
                            `**❌ | You Must Have "MANAGE_CHANNELS" Premission!**`
                        )
                    );
                }
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send(
                        new MessageEmbed()
                        .setColor("RED")
                        .setAuthor(
                            `❌ | uoh ..`
                        )
                        .setDescription(
                            `❌ | I Can't Create Channels Please Give Me "MANAGE_CHANNELS" Premission!`
                        )
                    );
                }
                if (!user) {
                    message.channel.send(
                        new MessageEmbed()
                        .setColor("RED")
                        .setAuthor(
                            `❌ | Please Mention The Room Onwer!`
                        )
                        .setDescription(
                            `❌ | For Example ${client.prefix}${module.exports.name} <@!${message.author.id}> 10m`
                        )
                    )
                    return;
                }
                if (!time) {
                    message.channel.send(
                        new MessageEmbed()
                        .setColor("RED")
                        .setAuthor(
                            `❌ | Please Type The Room End Time`
                        )
                        .setDescription(
                            `❌ | Time Have Be Like 1h 2w 10m`
                        )
                    );
                    return;
                }
                let everyone = message.guild.roles.cache.find(r => r.name === '@everyone');
                let category = message.guild.channels.cache.find(c => c.id === client.ctp && c.type === 'category');
                message.guild.channels.create(`${user.username}`, { type: 'text' }).then(async(ch) => {
                    await db.set(`Temp_Channel${message.author.id}`, {
                        name: ch.name,
                        id: user.id
                    })
                    if (category) {
                        ch.setParent(category.id);
                    }
                    ch.send(user,
                        new MessageEmbed()
                        .setColor('YELLOW')
                        .setAuthor(
                            `✅ | Done`
                        )
                        .setDescription(
                            `**✅ | Room has been successfully created!**`
                        )
                        .addField(
                            `Room Owner:`,
                            `\`${user.tag}\``,
                            true)
                        .addField(
                            `Room Created By:`,
                            `\`${message.author.tag}\``,
                            true)
                        .addField(
                            `The room created in:`,
                            `\`${moment(ch.createdAt).format("mm:HH DD/MM/YYYYs")}\``,
                            true)
                        .addField(
                            `Ends in:`,
                            `\`${moment((ms(time)) + ch.createdTimestamp).format("mm:HH DD/MM/YYYY")}\``,
                            true)
                    )
                    ch.createOverwrite(client.user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    ch.createOverwrite(everyone, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    })
                    ch.createOverwrite(user, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    setTimeout(function() {
                        ch.delete()
                        var channel_temp = db.get(`Temp_Channel${message.author.id}.name`)
                        user.send(
                            new MessageEmbed()
                            .setDescription(
                                `**🤔 | Wont To But Another Room? Dm "${message.guild.owner}"**`
                            )
                            .setAuthor(
                                `❌ | Your Temp Channel Has Been Closed`
                            )
                            .addField(
                                `📜 | Channel Name:`,
                                `\`${channel_temp}\``,
                                true)
                            .addField(
                                `🗿 | Server Name:`,
                                `${message.guild.name}`,
                                true
                            )
                            .addField(
                                `🕒 | End's Time`,
                                `\`${moment((ms(time)) + ch.createdTimestamp).format("DD/MM/YYYY")}\``,
                                true
                            )
                        )
                    }, ms(time));
                })
            } else if (args[1] === "rename") {
                var channel_temp = db.get(`Temp_Channel${message.author.id}.name`)
                var channel_temp2 = db.get(`Temp_Channel2_${message.author.id}.lol`)
                var userr = db.get(`Temp_Channel${message.author.id}.id`)
                if (message.author.id == userr) {
                    if (!args[2]) {
                        message.channel.send(
                            new MessageEmbed()
                            .setAuthor(
                                `❌ | Please Type The New Channel Name`
                            )
                            .setDescription(
                                `**❌ | You Must Type The New Channel Name**`
                            )
                        )
                        return;
                    } else {
                        let channel = message.guild.channels.cache.find(c => c.name === `${channel_temp || channel_temp2}`);
                        db.set(`Temp_Channel2_${message.author.id}`, {
                            lol: args[2]
                        })
                        channel.setName(args[2])
                        message.channel.send(
                            new MessageEmbed()
                            .setAuthor(
                                `✅ | Done`
                            )
                            .setDescription(
                                `**✅ | Done Changed \`${channel_temp}\` Name To ${args[2]}**`
                            )
                        )
                    }
                } else {
                    message.channel.send(
                        new MessageEmbed()
                        .setAuthor(
                            `❌ | You Aren't The Room Owner!`
                        )
                        .setDescription(
                            `**❌ | Only <@!${userr}> Can Edit \`${channel_temp}\` Channel!**`
                        )
                    )
                    return;
                }
            } else if (args[1] === "add") {
                var channel_temp = db.get(`Temp_Channel${message.author.id}.name`)
                var userr = db.get(`Temp_Channel${message.author.id}.id`)
                if (message.author.id == userr) {
                    let user = client.users.cache.get(message.content.split(' ')[3])
                    let channel = client.channels.cache.get(message.content.split(' ')[2])
                    if (!user) return message.channel.send(new MessageEmbed().setTitle("❌ | **Please Type ID Same One!**"));
                    if (message.channel.permissionsFor(user).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                        message.channel.send(`?`);
                        return;
                    }
                    if (!channel) return message.channel.send(new MessageEmbed().setTitle("❌ | **Please Type The Channel ID!**"));
                    channel.overwritePermissions([{
                        id: user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }]);
                    message.channel.send(
                        new MessageEmbed().setDescription(`✅ | **<@${user.id}> Successfully added to the channel**`)
                    );
                } else {
                    message.channel.send(
                        new MessageEmbed()
                        .setAuthor(
                            `❌ | You Aren't The Room Owner!`
                        )
                        .setDescription(
                            `**❌ | Only <@!${userr}> Can Edit \`${channel_temp}\` Channel!**`
                        )
                    )
                    return;
                }
            } else if (args[1] === "end") {
                var channel_temp = db.get(`Temp_Channel${message.author.id}.name`)
                var userr = db.get(`Temp_Channel${message.author.id}.id`)
                if (message.author.id == userr) {
                    message.channel.delete();
                } else {
                    message.channel.send(
                        new MessageEmbed()
                        .setAuthor(
                            `❌ | You Aren't The Room Owner!`
                        )
                        .setDescription(
                            `**❌ | Only <@!${userr}> Can Edit \`${channel_temp}\` Channel!**`
                        )
                    )
                    return;
                }
            } else {
                message.channel.send(
                    new MessageEmbed()
                    .setAuthor(`🤔 | Temp Orders!`)
                    .setThumbnail(message.author.avatarURL({ dynamic: true }))
                    .setColor("YELLOW")
                    .setFooter(`Requested By: ${message.author.tag}`)
                    .setTimestamp()
                    .addFields({
                        name: `${client.prefix}temp rename`,
                        value: `\`To Rename The Channel Name\``,
                        inline: true
                    }, {
                        name: `${client.prefix}temp add`,
                        value: `\`To Add Same One To Your Room\``,
                        inline: true
                    }, {
                        name: `${client.prefix}temp end`,
                        value: `\`To Close Your Room\``,
                        inline: true
                    }, )
                )
            }
        } catch (e) {
            console.log(chalk.red.bold(e));
            message.channel.send(':x: | Something went wrong ```' + e + '```');
        }
    }
}