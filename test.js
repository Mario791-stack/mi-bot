require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

console.log("Iniciando test...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on("ready", () => {
  console.log("BOT LISTO ✅");
});

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN PROMISE RESUELTA"))
  .catch(err => console.error("LOGIN ERROR:", err));