const { formatTime, formatTitle } = require("../main/functions.js");

module.exports = {
    aliases: ["np"],
    exe: async (m) => {

        const player = m.client.manager.players.get(m.guild.id);
        if (!player || !player.queue.current) return m.channel.send("I must be playing music first.");

        m.client.cd(m);
        const song = player.queue.current;
        let string = "";
        let end = undefined;

        if (song.isStream !== true) {

            const length = Math.floor((player.position / song.duration).toFixed(2) * 10);
            end = formatTime(song.duration);

            string = "⎯".repeat(length) + "🔘" + "⎯".repeat(10 - length);
            
        } else {

            end = "live";
            string = "⎯".repeat(5) + "🔴" + "⎯".repeat(5);

        };

        return m.channel.send("```ml\n" + formatTitle(song.title, 25, true) + "\n" + `${formatTime(player.position)} ${string} ${end}` + "\n```");
        
    },
};