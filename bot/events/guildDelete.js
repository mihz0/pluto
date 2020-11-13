const { webhook } = require("../main/functions.js");
const schema = require("../models/prefix.js");

module.exports = async (client, guild) => {

    webhook(`[-] ${guild.name} - ${guild.id}`, client.user.displayAvatarURL());
    const prefix = client.prefixes.get(guild.id);
    if (prefix) {
        client.prefixes.delete(guild.id);
        await schema.findOneAndDelete({ id: guild.id });
    };

};