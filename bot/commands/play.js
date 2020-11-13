const { formatTitle, deleteMessage } = require("../main/functions.js");
const erela_spotify_regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(.+)(?:[\/:])([A-Za-z0-9]+)/;

module.exports = {
    aliases: ["p"],
    exe: async (m) => {
        
        const { channel, channelID } = m.member.voice;
        const query = m.args.join(" ");
        if (!channel) return m.channel.send("You must have an active voice connection.");
        if (m.guild.me.voice.channel && m.guild.me.voice.channelID !== channelID) return m.channel.send("I'm already being used in an other voice channel.");
        if (channel.joinable !== true) return m.channel.send("I don't have the perms to join your voice channel.");
        if (!channel.permissionsFor(m.client.user.id).has(["SPEAK"])) return m.channel.send("I don't have the perms to speak in your voice channel.");
        if (query.length < 1) return m.channel.send("You must provide a query.");
        
        m.client.cd(m);
        
        try {

            const options = { query: query, source: "soundcloud" };
            if (erela_spotify_regex.test(query)) options.source = "youtube";
            const player = m.client.manager.create({ guild: m.guild.id, selfDeafen: true, voiceChannel: m.member.voice.channelID });
            if (player.queue.length > 500) return m.channel.send("There are too many songs in the music queue.");
            player.connect();
            
            const res = await m.client.manager.search(options, m.author);
            
            if (res.tracks.length < 1) return deleteMessage("Sadly, nothing has been found.", m.channel, 10);

            switch (res.loadType) {

                case "TRACK_LOADED":
                case "SEARCH_RESULT":

                    await player.queue.add(res.tracks[0]);
                    m.channel.send(`Enqueued \`${formatTitle(res.tracks[0].title)}\``);
                    if (!player.playing && !player.paused && !player.queue.size) player.play();
                
                break;

                case "PLAYLIST_LOADED":

                    m.client.cd(m, 10);
                    await player.queue.add(res.tracks);
                    m.channel.send(`Enqueued \`${formatTitle(res.playlist.name, 30)} [${res.tracks.length}]\``);
                    if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();

                break;

            };
            
        } catch (e) {
            return deleteMessage("Something unexpected happened.", m.channel, 10);
        };

    },
};
