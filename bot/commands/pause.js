module.exports = {
    aliases: ["resume", "pa", "re"],
    exe: async (m) => {

        const player = m.client.manager.players.get(m.guild.id);
        const { channel, channelID } = m.member.voice;
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");
        if (player.queue.current.isStream === true && player.playing === true) return m.channel.send("Livestreams cannot be paused.");

        m.client.cd(m);
        player.pause(player.playing);
        return m.client.re(m);

    },
};