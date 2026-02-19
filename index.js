require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Bot encendido 🚀');
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content === '!preguntas') {
    message.reply(`1- ¿Qué dará cada uno?
2- ¿Ambos pueden por link?
3- Si no pueden, ¿cuáles son vuestros nombres de usuario?`);
}

});

client.login(process.env.TOKEN);
