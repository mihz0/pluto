module.exports = async (client, _old, _new) => {

    if (_old.region !== _new.region){

        const player = client.manager.players.get(_new.id);
        if (player) player.destroy();

    };

};