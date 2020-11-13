module.exports = {
    aliases: ["vote", "uv"],
    exe: async (m) => {

        m.client.cd(m, 15);
        return m.channel.send("My DBL-page: <https://top.gg/bot/656851901756866600>");

    },
};