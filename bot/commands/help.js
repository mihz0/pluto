module.exports = {
    aliases: ["commands", "h"],
    exe: async (m) => {

        const prefix = m.client.prefixes.get(m.guild.id) || m.client.prefix;
        m.client.cd(m, 15);
        return m.channel.send({ embed : {
            author: {
                name: `Prefix here: ${prefix}`,
                icon_url: m.guild.iconURL({ dynamic: true }),
            },
            color: m.client.colour,
            description: "`play` `search` `queue` `np` `stop`\n`bb` `join` `leave` `loop` `pause`\n`cq` `prefix` `remove` `seek` `skip`\n `skip-to` `shuffle` `stop` `volume`",
        }});

    },
};