const { Collection, MessageEmbed } = require('discord.js');
const cooldowns = new Map();

module.exports = async(client, message) => {
    var prefix = client.prefix;
    if (message.channel.type == "dm") return;
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase()
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))
    if (!command) return
    if (!cooldowns.has(command.name)) {
        const coll = new Collection()
        cooldowns.set(command.name, coll)
    }
    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000
    if (time_stamps.has(message.author.id)) {
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
        if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000
            return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`**❌ | You Are In Cooldown Please Wait \`${time_left.toFixed(1)}\` To Use \`${command.name}\` Again**`))
        }
    }

    time_stamps.set(message.author.id, current_time)
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

    try {
        command.run(client, message, args);
    } catch (e) {
        console.log(chalk.red.bold(e));
        message.channel.send(':x: | Something went wrong ```' + e + '```');
    }
}