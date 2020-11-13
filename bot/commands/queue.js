const { queuePage } = require("../main/functions.js");

module.exports = {
    aliases: ["q"],
    exe: async (m) => {

        const player = m.client.manager.players.get(m.guild.id);
        if (!player || !player.queue.current || player.queue.length < 1) return m.channel.send("The music queue is empty.");

        let current_page = 0;
        const pages = Math.ceil((player.queue.length-1)/10);
        const msg = await m.channel.send("```ml\n" + queuePage(current_page, player.queue) + "\n```");

        if (pages < 2) return m.client.cd(m);
        else m.client.cd(m, 6);

        const queue = [];
        const emojis = ["⬆️", "⬇️"];
        for (const song of player.queue) queue.push({ title: song.title, duration: song.duration });
        for (const emoji of emojis) msg.react(emoji).catch(() => {});

        msg.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && user.id === m.author.id, { time: 30 * 1000 })
        .on("collect", async (reaction) => {

            switch (reaction.emoji.name){

                case "⬆️":

                    if (current_page !== 0){
                        current_page--;
                        msg.edit("```ml\n" + queuePage(current_page, queue) + "\n```");
                    };

                break;

                case "⬇️":

                    if (current_page+1 !== pages){
                        current_page++;
                        msg.edit("```ml\n" + queuePage(current_page, queue) + "\n```");
                    };

                break;

            };
            
        });
        
    },
};