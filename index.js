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
if (message.content === '!hits') {
    message.reply(`❗ Has sido estafado ❗

Pero no todo son malas noticias.

Puedes conseguir más cosas uniéndote a nosotros.

1️⃣ **Encuentra a una persona (puede ser de cualquier juego).**
2️⃣ **Dile que usan middleman en este server.**
3️⃣ **El middleman te ayudará y repartirán mitad y mitad contigo.**

(Algunos middlemans te pueden dar el 100% si así lo gustan)

📢 **Únete a nosotros**
• Si te unes fácilmente recuperarás tus cosas y conseguirás mejores.
• Esta es una oportunidad increíble para que consigas muchas cosas.

⚠️ **El único requisito es compartir lo que consigas 50/50 o 100% dependiendo del middleman.**`);
}
});
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor web activo en puerto " + PORT);
});

client.login(process.env.TOKEN);
