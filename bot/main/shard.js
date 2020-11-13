require("dotenv").config();
const { ShardingManager } = require("discord.js");

new ShardingManager("./main/index.js", {
    token: process.env.DISCORD_TOKEN,
    totalShards: +process.env.TOTAL_SHARDS,
})
.on("shardCreate", shard => console.log(`[Shard ${shard.id}] launched`))
.spawn();