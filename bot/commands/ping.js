module.exports = {
    aliases: [],
    exe: async (m) => {

        if (m.author.id !== m.client.owner) {
            m.client.cd(m);
            return m.channel.send(`${Math.round(m.client.ws.ping)} ms.`);
        };

        let string = "";
        const pings = await m.client.shard.broadcastEval("this.ws.ping");
        
        for (const ping of pings) string += `${ping}, `;

        return m.channel.send("```js\n" + `[${string.slice(0, -2)}]` + "\n```");

    },
};