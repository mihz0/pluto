module.exports = (client) => {
    
    console.log(`[${client.user.tag}] online`);
    require("../main/index.js").ready(client);
    
};
