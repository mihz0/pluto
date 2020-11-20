module.exports = {
    aliases: ["le"],
    exe: async (m) => {

        const player = m.client.manager.players.get(m.guild.id);
        const { channel, channelID } = m.member.voice;
        if (!player) return m.channel.send("I'm not connected to any voice channel here.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");
        
        m.client.cd(m);
        return player.destroy();
        
    },
};
