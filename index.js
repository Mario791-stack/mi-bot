require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    ChannelType
} = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers
    ]
});

client.once('clientReady', () => {
    console.log('Bot encendido 🚀');
console.log("actualizacion");
});

const prefix = '!';

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'preguntas') {
        message.reply(`1- ¿Qué dará cada uno?
2- ¿Ambos pueden por link?
3- Si no pueden, ¿cuáles son vuestros nombres de usuario?`);
    }

if (command === 'fianza') {
    message.reply(`**Fianza**
Para ser mm se pide una fianza como medida de seguridad, ya que funciona como una garantía en caso de que el MM intente realizar una estafa, permitiendo al servidor compensar a la víctima; una vez que el MM completa su primer trade de forma correcta y sin problemas, demuestra que es confiable y la fianza se le devuelve, dejando claro que no es un pago sino una garantía temporal para proteger a los usuarios y mantener la confianza en el sistema.`);
}

    if (command === 'hits') {
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

if (command === 'mm') {
    message.reply(`1- ¿Tienes experiencia como midddleman?
2- ¿Tienes algun antecedente como estafador?
3- ¿De que país eres?
4- ¿Qué edad tienes?
5- ¿Puedes dejar fianza?
6- ¿Porqué desea ser middleman?
7- ¿Que tipo de middleman desea ser, alto o bajo?`);

    }

if (command === 'ticketpanel') {

    const embed = new EmbedBuilder()
        .setTitle('💼 Pedir Middleman 🤝')
        .setDescription(`🧑‍💼 ¿Qué es un Middleman?

Un Middleman es una persona de confianza dentro del servidor que actúa como intermediario en un intercambio entre dos usuarios, con el objetivo de evitar estafas y asegurar que ambas partes cumplan con lo acordado 🔒✨.

⚙️ ¿Cómo funciona el proceso?

1️⃣ El primer usuario entrega su objeto al Middleman 📦
2️⃣ El segundo usuario realiza el pago acordado al primer usuario 💸
3️⃣ Una vez verificado que todo está correcto ✅, el Middleman entrega el objeto al segundo usuario 🎁

🔐 De esta manera, ambas partes pueden realizar el intercambio de forma segura, transparente y confiable.`)
        .setColor(0x2b2d31)
        .setImage('https://images-ext-1.discordapp.net/external/iDvEX-4xxVkV3Az48LWY5ArkKghZPOWTqk6mWUjwaQQ/https/tr.rbxcdn.com/180DAY-532688f9fd79d5108fe24db2c17725cf/500/280/Image/Jpeg/noFilter?format=webp&width=623&height=350');

    const menu = new StringSelectMenuBuilder()
        .setCustomId('seleccionar_categoria')
        .setPlaceholder('Selecciona una categoría')
        .addOptions([
            {
                label: 'Soporte General',
                description: 'Ayuda del servidor',
                value: 'soporte'
            },
            {
                label: 'Reportes',
                description: 'Reportar usuario',
                value: 'reporte'
            }
        ]);
    const row = new ActionRowBuilder().addComponents(menu);

    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}

client.on('interactionCreate', async interaction => {

    try {

        // =========================
        // SELECT MENU - CREAR TICKET
        // =========================
        if (interaction.isStringSelectMenu() && interaction.customId === 'seleccionar_categoria') {

            await interaction.reply({
                content: "⏳ Creando ticket...",
                ephemeral: true
            });

            const categoria = interaction.values[0];

            const canal = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}-${categoria}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ],
                    }
                ]
            });

            const embedTicket = new EmbedBuilder()
                .setTitle('🎟️ Ticket de Soporte')
                .setDescription(`👤 Usuario: ${interaction.user}

🟢 Estado: Abierto
📌 Esperando que el staff lo reclame.`)
                .setColor(0x5865F2)
                .setTimestamp();

            const botones = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('reclamar_ticket')
                    .setLabel('Reclamar')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📌'),

                new ButtonBuilder()
                    .setCustomId('cerrar_ticket')
                    .setLabel('Cerrar')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

            await canal.send({
                content: `${interaction.user}`,
                embeds: [embedTicket],
                components: [botones]
            });

            await interaction.editReply({
                content: `✅ Ticket creado: ${canal}`
            });

            return;
        }

        // =========================
        // BOTÓN RECLAMAR
        // =========================
        if (interaction.isButton() && interaction.customId === 'reclamar_ticket') {

            await interaction.reply({
                content: `📌 Ticket reclamado por ${interaction.user}`
            });

            await interaction.channel.setName(`ticket-reclamado-${interaction.user.username}`);
            return;
        }

        // =========================
        // BOTÓN CERRAR
        // =========================
        if (interaction.isButton() && interaction.customId === 'cerrar_ticket') {

            await interaction.reply({
                content: '🔒 Cerrando ticket en 5 segundos...',
                ephemeral: true
            });

            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 5000);

            return;
        }

    } catch (error) {
        console.error(error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Ha ocurrido un error.",
                ephemeral: true
            }).catch(() => {});
        }
    }

});


// =====================
// SERVIDOR EXPRESS
// =====================

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
