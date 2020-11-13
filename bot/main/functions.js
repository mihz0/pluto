function formatTitle (string, max=50, remove) {

    let new_string = "";
    const split = string.toLowerCase().trim().split("");
    let letters = [
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n", "o","p","q","r","s","t","u","v","w","x","y","z",
        "0","1","2","3","4","5","6","7","8","9",
        ",",".","/","?",";",":","[","]","{","}","(",")", "_", "$", "@", "&", "+", " ",
    ];
    
    for (const letter of split)
        if (letters.includes(letter)) new_string += letter;

    new_string = new_string.replace(/\s+/g, " ").trim();
    if (new_string.length < 1) new_string = "song";
    new_string = new_string.split(" ").map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(" ");

    return new_string.length > max
    ? new_string.substring(0, max-2) + ".."
    : new_string;

};

function queuePage (page, queue, boolean){

    let string = "";

    for (let i = 10*page; i < queue.length && i < 10*page+10; i++)
        string += `${i+1}${queuePageSpace(5, i)}${queuePageTitle(queue[i].title)}${formatTime(queue[i].duration)}\n`;

    if (queue.length - (page+1)*10 > 0)
        string += `+${queuePageSpace(5, 1)}${queue.length-(page+1)*10} song${queue.length-(page+1)*10 !== 1 ? "s" : ""}..`;

    return string;

};

function formatTime (duration) {

    let seconds = Math.round(duration / 1000);
    let minutes = 0;
    let hours = 0;
    let string = "";

    if (seconds >= 60){
        for (let i = 0; seconds >= 60; i++){
            seconds -= 60;
            minutes += 1;
        };
    };

    if (minutes >= 60){
        for (let i = 0; minutes >= 60; i++){
            minutes -= 60;
            hours += 1;
        };
    };

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    string = `${minutes}:${seconds}`;

    if (hours > 0){
        if (hours < 10) hours = `0${hours}`;
        string = `${hours}:${string}`;
    };

    return string;

};

function deleteMessage (text, channel, time){

    channel.send(text)
    .then(m => m.delete({ timeout: time * 1000 }))
    .catch(e => console.log(`[deleteMessage.error] + ${e.message}`));

};

function queuePageTitle (string) {

    const _string = formatTitle(string, 80, true);

    return _string + " ".repeat(100 - _string.length);

};

function queuePageSpace (repeat, song_number){

    const minus = (song_number+1).toString().length;
    const _space = " ".repeat(repeat - (minus-1));

    return _space;

};

function addRatelimit (m) {

    const array = [m.author.id, m.guild.id];
    for (const item of array) {
        m.client.ratelimit.add(item);
        setTimeout(() => m.client.ratelimit.delete(item), 1 * 1000);
    };
    
};

const cs = require("callsites");
function addCooldown (m, time=3) {

    const array = cs()[1].getFileName().split("\\"); // depends on path.
    const name = array[array.length-1].split(".js")[0];
    const guild = m.guild.id;

    m.client.cooldown.add(`${guild}-${name}`);
    setTimeout(() => m.client.cooldown.delete(`${guild}-${name}`), time * 1000);

};

const set = new Set();
function mentioned (m) {
    
    if (set.has(m.guild.id)) return;
    set.add(m.guild.id);
    setTimeout(() => set.delete(m.guild.id), 10 * 1000);
    
    const prefix = m.client.prefixes.get(m.guild.id) || m.client.prefix;
    if (m.channel.permissionsFor(m.guild.me).has(["EMBED_LINKS"])){
        deleteMessage({ embed : {
            color: m.client.colour,
            description: `My prefix here is \`${prefix}\``,
        }}, m.channel, 30);
    }
    else deleteMessage(`My prefix here is \`${prefix}\`.`, m.channel, 30);

};


const { WebhookClient } = require("discord.js");
const wh = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
function webhook (text, avatar) {

    wh.send(text, {
        avatarURL: avatar,
    })
    .catch(e => console.log(e));
    
};

const emoji = process.env.EVENT_EMOJI && process.env.EVENT_EMOJI !== "null" ? process.env.EVENT_EMOJI : "👍🏿";
function messageReact (m) {
    return m.react(emoji);
};


module.exports = {
    formatTitle: formatTitle,
    queuePage: queuePage,
    formatTime: formatTime,
    deleteMessage: deleteMessage,
    addRatelimit: addRatelimit,
    addCooldown: addCooldown,
    mentioned: mentioned,
    webhook: webhook,
    messageReact: messageReact,
};