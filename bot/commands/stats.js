module.exports = {
    aliases: [],
    developer: true,
    exe: async (m) => {

        const guilds = await m.client.shard.fetchClientValues("guilds.cache.size");
        const members = await m.client.shard.broadcastEval("this.guilds.cache.reduce((a, b) => a + b.memberCount, 0)");

        return m.channel.send("```\n" + format(["guilds", guilds.reduce((a, b) => a + b, 0), "members", members.reduce((a, b) => a + b, 0)]) + "\n```");
        
    },
};

function format (array) {

    let string = "";
    for (let i = 0; i < array.length; i += 2) {

        string += array[i] + " ".repeat(15 - array[i].length) + array[i+1];
        i < array.length-2 ? string += "\n" : null;

    };

    return string;

};