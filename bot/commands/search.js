const { formatTitle, deleteMessage, queuePage } = require("../main/functions.js");
const erela_spotify_regex = /(?:https:\/\/open\.spotify\.com\/|spotify:)(.+)(?:[\/:])([A-Za-z0-9]+)/;
const set = new Set();

module.exports = {
    aliases: ["s"],
    exe: async (m) => {

        if (set.has(m.author.id)) return;
        
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

            set.add(m.author.id);
            const tracks = res.tracks.slice(0, 3);
            const selection = [];
            for (const track of tracks) selection.push({ title: track.title, duration: track.duration });

            const reg = `1${selection.length > 1 ? `-${selection.length}` : ""}`;
            const msg = await m.channel.send("```ml\n" + queuePage(0, selection, true) + `&${" ".repeat(5)}type ${reg} or cancel.\n\`\`\``);
            const collector = m.channel.createMessageCollector(x => x.author.id === m.author.id && new RegExp(`^([${reg}]|cancel)$`, "i").test(x.content), { time: 30 * 1000 })
            .on("collect", async (_m) => {

                if (/cancel/i.test(_m.content)) return collector.stop();

                await collector.stop(true);
                const track = tracks[+_m.content-1];
                await player.queue.add(track);
                msg.edit(`Enqueued \`${formatTitle(track.title)}\``);
                if (!player.playing && !player.paused && !player.queue.size) player.play();


            })
            .on("end", (a, b) => {

                if (b !== true) msg.delete();
                set.delete(m.author.id);

            });

        } catch (e) {
            return deleteMessage("Something unexpected happened.", m.channel, 10);
        };

    },
};