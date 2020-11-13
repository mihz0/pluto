module.exports = {
    aliases: ["j"],
    exe: async (m) => {

        const { channel } = m.member.voice;
        if (m.guild.me.voice.channel) return m.channel.send("I'm already connected to a voice channel.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (channel.joinable !== true) return m.channel.send("I don't have the perms to join your voice channel.");
        if (!channel.permissionsFor(m.client.user.id).has(["SPEAK"])) return m.channel.send("I don't have the perms to speak in your voice channel.");
        
        m.client.cd(m);
        return m.client.manager.create({ guild: m.guild.id, selfDeafen: true, voiceChannel: m.member.voice.channelID })
        .connect();

    },
};