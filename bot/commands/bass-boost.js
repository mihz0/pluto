module.exports = {
    aliases: ["bassboost", "bb"],
    plus: true,
    exe: async (m) => {

        const { channel, channelID } = m.member.voice;
        const player = m.client.manager.players.get(m.guild.id);
        const number = m.args[0];
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");
        if (isNaN(number) || number < 0 || number > 1) return m.channel.send("You must provide a number between 0 and 1.");

        m.client.cd(m, 7);

        const EQ = [];
        for (let i = 0; i < player.bands.length; i++) EQ.push({ band: i, gain: number });

        player.setEQ(...EQ);
        return m.client.re(m);
        

    },
};