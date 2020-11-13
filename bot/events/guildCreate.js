const { webhook } = require("../main/functions");

module.exports = (client, guild) => {

    webhook(`[+] ${guild.name} - ${guild.id}`, client.user.displayAvatarURL());
    const text = `**Thank you for inviting me**.\nMy prefix here is \`${client.prefix}\` by default.\nType \`${client.prefix}help\` for my command-list.`;

    for (const channel of guild.channels.cache.array()) {

        if (channel.type !== "text" || !channel.permissionsFor(guild.me).has(["VIEW_CHANNEL", "SEND_MESSAGES"])) continue;

        channel.send(text);
        break;

    };
    
};