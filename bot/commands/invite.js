module.exports = {
    aliases: ["i"],
    exe: async (m) => {

        m.client.cd(m, 15);
        return m.channel.send("My invite-link: <https://discord.com/oauth2/authorize?client_id=656851901756866600&scope=bot&permissions=37047360>.");

    },
};