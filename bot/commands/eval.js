const { inspect } = require("util");

module.exports = {
    aliases: ["e"],
    developer: true,
    exe: async (m) => {
        
        const code = m.args.join(" ");
        let output = null;

        try {

            output = await eval(code);
            if (typeof output !== "string") output = inspect(output, { depth: 2 });
            if (output.length > 1990) output = output.substring(0, 1990);
            
        } catch (e){
            output = e;
        };

        return m.channel.send("```js\n" + output + "\n```");

    },
};