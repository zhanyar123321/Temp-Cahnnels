const ids = require('./config/ids.json');
const bot = require('./config/bot.json');

/* [ !-- ( Settings! ) --! ] */
 
const settings = {
    prefix: bot.PREFIX,
    temp_voice_channel_id: ids.temp_voice_channel_id,
    category_temp_text_channel_id: ids.temp_text_channel_category_id
}

/* [ !-- ( Source Code! ) --! ] */
const chalk = require('chalk')
const express = require("express");
const app = express();
app.listen(() => console.log(chalk.red.bold(":) Thx: @GT |    ↬       𝑩𝒓𝒐𝒎 🇮🇶⃤#9664")));
app.use('/ping', (req, res) => {
    res.send(new Date());
    res.send(`All Copyrights Go's To: NIR0`)
});

const { Client, Collection } = require("discord.js");
const client = new Client();
const fs = require('fs');
const voiceCollection = new Collection();

client.on("ready", async() => {
    client.user.setActivity(bot.ACTIVITY, {
        type: "PLAYING",
    })
    console.log(chalk.green.bold(`[ ${client.user.tag} ] `) + chalk.yellow.bold(`is ready`));
});
client.commands = new Collection();
client.prefix = settings.prefix;
client.ctp = settings.category_temp_text_channel_id;

client.on("warn", console.warn);
client.on("error", console.error);


client.on(`warn`, (info) => console.log(info));
client.on(`error`, console.error);
fs.readdir(`./src/commands/`, (err, files) => {
    if (err) return console.log(chalk.red.bold((err)));
    files.forEach(file => {
        let commandName = file.split('.')[0];
        if (!file.endsWith(".js")) return console.log(chalk.red.bold('Can\'t Load "' + commandName + '"'))
        const command = require(`./src/commands/${file}`);
        console.log(chalk.yellow.bold("Loading Bot Command \"" + commandName + "\""))
        console.log(chalk.yellow.bold("Loading Bot Command \"" + "temp add" + "\""))
        console.log(chalk.yellow.bold("Loading Bot Command \"" + "temp rename" + "\""))
        console.log(chalk.yellow.bold("Loading Bot Command \"" + "temp end" + "\""))
        console.log(chalk.yellow.bold("Loading Bot Command \"" + "temp new" + "\""))
        client.commands.set(command.name, command);
    })
});
fs.readdir('./src/events/', (err, files) => {
    if (err) return console.log(chalk.red.bold(err));
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./src/events/${file}`);
  "      let ev"ntName = file.split('.')[0];
        console.log(chalk.magenta.bold(`Loading Bot Event ${eventName}!`));
        client.on(eventName, event.bind(null, client));
    });
});

client.on('voiceStateUpdate', async(oldState, newState) => {
    const user = await client.users.fetch(newState.id);
    const member = newState.guild.member(user);
    if (!oldState.channel && newState.channel.id === settings.temp_voice_channel_id) {
        const channel = await newState.guild.channels.create(user.username, {
            type: 'voice',
            parent: newState.channel.parent,
        })
        member.voice.setChannel(channel);
        voiceCollection.set(user.id, channel.id);
        channel.overwritePermissions([{
            id: user.id,
            allow: ["MANAGE_CHANNELS"]
        }]);
    } else if (!newState.channel) {
        if (oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
    }
});

client.login(process.env.ODkzMDc3MDc5OTIxNDE0MTc1.YVWM2A.g2ao-Fcn8X8WXCwE1GcNw2dsjy0);
