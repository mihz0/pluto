module.exports = async (client, _old, _new) => {

    if (_new === null && _old.id === client.user.id) {
        const player = client.manager.players.get(_old.member.guild.id);
        if (player) player.destroy();
    };

    if (_new === null) {

        const guild = _old.member.guild;
        if (guild.me.voice.channel !== null && _old.channelID === guild.me.voice.channelID) {

            if (_old.channel.members.filter(m => !m.user.bot).size < 1){
                const player = client.manager.players.get(guild.id);
                if (player) inactivity(guild);
            };
        };
    };

    if (_new !== null && _old !== null && _new.id === client.user.id) {
        
        if (_new.channel.members.filter(m => m.user.bot === false).size < 1) {
            const player = client.manager.players.get(_new.guild.id);
            if (player) inactivity(_new.guild);
        };
    };
    
};

function inactivity (guild) {

    setTimeout(() => {

        if (guild.me.voice.channel !== null && guild.me.voice.channel.members.filter(m => m.user.bot === false).size < 1) {
            guild.client.manager.players.get(guild.id).destroy();
        };

    }, 30 * 1000);

};