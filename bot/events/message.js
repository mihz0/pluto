const { addRatelimit, mentioned, deleteMessage } = require("../main/functions.js");

module.exports = async (client, m) => {

    if (m.channel.type !== "text" || m.author.bot !== false) return;

    const prefix = client.prefixes.get(m.guild.id) || client.prefix;
    const command_regex = new RegExp(`^(<@!?${client.user.id}>\s?|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
    const mention_regex = new RegExp(`(<@!?${client.user.id}>)$`);

    if (!command_regex.test(m.content)) return;
    if (mention_regex.test(m.content)) return mentioned(m);
    
    const [, matched] = m.content.match(command_regex);
    m.args = m.content.slice(matched.length).trim().split(/ +/);
    let name = m.args.shift().toLowerCase();
    let command = null;

    const _command = client.commands.get(name);
    if (_command) command = _command;
    else {
        const _aliase = client.aliases.get(name);
        if (_aliase){
            name = _aliase;
            command = m.client.commands.get(name);
        };
    };

    if (command === null || !m.channel.permissionsFor(m.guild.me).has(["SEND_MESSAGES"])) return;
    if (client.ratelimit.has(m.author.id || m.guild.id)) return;
    if (client.cooldown.has(`${m.guild.id}-${name}`)) return;
    if (command.developer === true && m.author.id !== client.owner) return;
    addRatelimit(m);
    
    if (command.vote === true) {
        const voted = await vote(m);
        if (voted !== true) return;
    };
    if (command.plus === true && plus(m) !== true) return;

    return command.exe(m);

};

const schema = require("../models/vote");
async function vote (m) {

    const voted = await schema.findOne({ id: m.author.id });
    if (voted) return true;

    if (m.channel.permissionsFor(m.guild.me).has(["EMBED_LINKS"])){
        m.channel.send({ embed: {
            color: m.client.colour,
            description: "You must [upvote](https://top.gg/bot/656851901756866600/vote) me\nto use this command.",
        }});
    }
    else deleteMessage("You must upvote me to use this command.\n<https://top.gg/bot/656851901756866600/vote>", m.channel, 45);

};


function plus (m) {
    
    if (m.client.plus.has(m.author.id)) return true;

    if (m.channel.permissionsFor(m.guild.me).has(["EMBED_LINKS"])){
        m.channel.send({ embed: {
            color: m.client.colour,
            description: "You must have [pluto+](https://www.patreon.com/plutooo)\nto use this command.",
        }});
    }
    else deleteMessage("You must have pluto+ to use this command.\n<https://www.patreon.com/plutooo>", m.channel, 45);

};