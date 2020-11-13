module.exports = {
    aliases: ["sh"],
    vote: true,
    exe: async (m) => {

        const { channel, channelID } = m.member.voice;
        const player = m.client.manager.players.get(m.guild.id);
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");

        m.client.cd(m);
        player.queue.shuffle();
        return m.client.re(m);

    },
};