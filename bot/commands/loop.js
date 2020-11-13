const { deleteMessage } = require("../main/functions.js");

module.exports = {
    aliases: ["lo"],
    exe: async (m) => {
        
        const player = m.client.manager.players.get(m.guild.id);
        const { channel, channelID } = m.member.voice;
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");

        m.client.cd(m);
        if (!m.args[0] || !["queue", "q"].includes(m.args[0].toLowerCase())){
            player.setTrackRepeat(!player.trackRepeat)
            deleteMessage(`*${player.trackRepeat === true ? "L" : "Not l"}ooping.*`, m.channel, 3);
        }
        else {
            player.setQueueRepeat(!player.queueRepeat);
            deleteMessage(`*${player.queueRepeat === true ? "L" : "Not l"}ooping the music queue.*`, m.channel, 3);
        };

        return m.client.re(m);

    },
};