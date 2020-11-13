const schema = require("../models/prefix.js");

module.exports = {
    aliases: ["pr"],
    plus: true,
    exe: async (m) => {

        if (!m.member.permissions.has(["MANAGE_GUILD"]) && m.author.id !== m.client.owner) return m.channel.send("You're missing the `manage_guild` permission here.");

        const prefix = m.client.prefixes.get(m.guild.id) || m.client.prefix;
        const cached = m.client.prefixes.get(m.guild.id);
        const arg_1 = m.args[0] ? m.args[0].toLowerCase() : null;
        const arg_2 = m.args.slice(1).join(" ").replace(/ +/g, "");

        if (arg_1 === "set" && arg_2 === prefix) return m.channel.send(`My prefix here, is already \`${prefix}\`.`);
        else m.client.cd(m, 5);

        if (["reset", "remove"].includes(arg_1) || (arg_1 === "set" && arg_2 === m.client.prefix)) {

            if (cached === undefined) return m.channel.send("No custom prefix had been set.");
            await schema.findOneAndDelete({ id: m.guild.id });
            m.client.prefixes.delete(m.guild.id);
            return m.channel.send(`Reset my prefix here, to \`${m.client.prefix}\`.`);

        } else if (arg_1 === "set") {

            if (arg_2.length < 1) return m.channel.send("You must provide a new prefix.");
            if (arg_2.length > 20) return m.channel.send("You must provide a new prefix with a length less than 20 characters.");

            if (cached !== undefined) await schema.findOneAndUpdate({ id: m.guild.id }, { prefix: arg_2 });
            else {
                const to_save = new schema({ id: m.guild.id, prefix: arg_2 });
                await to_save.save();
            };
                
            m.client.prefixes.set(m.guild.id, arg_2);
            return m.channel.send(`My prefix here, is now \`${arg_2}\`.`);

        } else m.channel.send("Provide \`set <new_prefix>\` or `reset`.");

    },
};