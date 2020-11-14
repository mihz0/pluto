const { Client } = require("discord.js-light");
const client = new Client({
    cacheRoles: true,
    cacheChannels: true,
    cacheOverwrites: true,
});


const { Collection } = require("discord.js");
for (const x of ["prefixes", "commands", "aliases"]) client[x] = new Collection();
for (const x of ["cooldown", "ratelimit", "plus"]) client[x] = new Set();
client.owner = process.env.MIHZ0_ID;
client.prefix = process.env.PREFIX;
client.channel = process.env.CHANNEL;
client.colour = "C29E81";
client.cd = require("./functions.js").addCooldown;
client.re = require("./functions.js").messageReact;


const { Manager } = require("erela.js");
const _spotify = require("erela.js-spotify");
const clientID = process.env.SPOTIFY_CLIENTID;
const clientSecret = process.env.SPOTIFY_CLIENTSECRET;
const convertUnresolved = false;
const playlistLimit = 1;
const albumLimit = 1;
client.manager = new Manager({
    nodes: [{ host: process.env.LAVALINK_HOST, port: +process.env.LAVALINK_PORT, password: process.env.LAVALINK_PASSWORD}],
    plugins: [new _spotify({ clientID, clientSecret, convertUnresolved, playlistLimit, albumLimit })],
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
}})
.on("nodeError", (node, error) => console.log(node, error))
.on("trackStuck", (player, track) => {
    player.stop();
    console.log(`[trackStuck] ${track.title} ${player.guild}`);
});


process.on("uncaughtException", error => console.log(error));
process.on("unhandledRejection", error => console.log(error));


const { readdirSync } = require("fs");
const { join } = require("path")
const folder = join(__dirname, "..", "commands");
const files = readdirSync(folder);
for (const file of files) {

    const command = require(`${folder}/${file}`);
    const name = file.split(".")[0];
    client.commands.set(name, command);
    for (const alias of command.aliases) client.aliases.set(alias, name);

};


const _folder = join(__dirname, "..", "events");
const _files = readdirSync(_folder);
for (const file of _files) client.on(file.split(".")[0], require(`${_folder}/${file}`).bind(null, client));


const { connect } = require("mongoose");
connect(process.env.MONGO1, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});


module.exports.ready = async (client) => {

    client.on("raw", data => client.manager.updateVoiceState(data));
    client.manager.init(client.user.id);


    const schema = require("../models/prefix.js");
    const res = await schema.find();
    for (const guild of res) {

        const _guild = client.guilds.cache.get(guild.id);
        if (_guild) client.prefixes.set(guild.id, guild.prefix);

    };
    

    const _schema = require("../models/plus.js");
    const _res = await _schema.find();
    for (const user of _res) client.plus.add(user.id);

    
    if (+client.options.shards.toString()+1 === client.options.shardCount && client.user.username.toLowerCase() === "pluto"){

        const _dbl = require("dblapi.js");
        const dbl = new _dbl(process.env.DBL_TOKEN);
        setInterval(async() => {

            const guilds = await client.shard.fetchClientValues("guilds.cache.size");
            dbl.postStats(guilds, +client.options.shards.toString(), client.options.shardCount);

        }, 3600 * 1000);

    };

};


return client.login(process.env.DISCORD_TOKEN);
