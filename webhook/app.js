require("dotenv").config();

const connect = async function () {

    const { connect } = require("mongoose");
    await connect(process.env.MONGO, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

};

connect();

const { WebhookClient } = require("discord.js");
const wh = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
const schema = require("./model.js");
const pack = require("dblapi.js");
const dbl = new pack(
    process.env.DBL_TOKEN,
    {
        webhookPort: process.env.PORT,
        webhookAuth: process.env.AUTH,
    },
);

dbl.webhook.on("ready", hook => console.log(hook));
dbl.webhook.on("vote", vote => {

    if (vote.type === "test") vote.user += " (test)";

    const _delete = function (id) {

        setTimeout(async () => {
            await schema.findOneAndDelete({ id: id });
            console.log(`[-] ${id}`);
        }, 12 * 60 * 60 * 1000);

    };

    const _save = new schema({ id: vote.user });
    _save.save();
    _delete(vote.user);
    wh.send(`[^] ${vote.user}`).catch(e => console.log("[Webhook error]", e));

});
