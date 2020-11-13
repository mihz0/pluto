module.exports = {
    aliases: [],
    exe: async (m) => {

        const { channel, channelID } = m.member.voice;
        const player = m.client.manager.players.get(m.guild.id);
        const number = m.args[0];
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");
        if (isNaN(number)) return m.channel.send("You must provide the number of the song.");

        if (+number === 0) return m.client.commands.get("skip").exe(m);
        if (!player.queue[+number-1]) return m.channel.send("You must provide an item that exists in the music queue.");
        
        m.client.cd(m);
        player.queue.remove(+number-1);
        return m.client.re(m);

    },
};