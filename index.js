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

const fs = require("fs"); 


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

client.on('ready', async () => {
    console.log('Bot encendido 🚀');
    console.log("actualizacion");

  });
const prefix = '!';

const BAN_LOG_CHANNEL_ID = "1475934904729473166";
const UNBAN_LOG_CHANNEL_ID = "1475935581379887348";
const WARN_LOG_CHANNEL_ID = "1475937903803895959";


const LOG_INVITES_CHANNEL = "1472174667648335974"; 
const STAFF_ROLES = [
    "1470659883442634854",
    "1471961551765508326",
    "1471961564893679801",
    "1471961557993918474",
    "1471961556525776997",
    "1471961552784457829",
    "1471961557276692763",
    "1471961549861031968",
    "1471961563484258384",
    "1471961570132361489",
    "1471961584367833129",
    "1471961585055699106",
    "1471961585848287413",
    "1473377615606710476",
    "1471961562674888857",

];

const ROLES_A_MENCIONAR = [
    "1470659883442634854",
    "1471961551765508326",
    "1471961564893679801",
    "1471961557993918474",
    "1471961556525776997",
    "1471961552784457829",
    "1471961557276692763",
    "1471961549861031968",
    "1471961563484258384",
    "1471961570132361489",
    "1471961584367833129",
    "1471961585055699106",
    "1471961585848287413",
    "1473377615606710476",
    "1471961562674888857",

    
];

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'preguntas') {
        message.reply(`1- ¿Qué dará cada uno?
2- ¿Ambos pueden por link?
3- Si no pueden, ¿cuáles son vuestros nombres de usuario?`);
    }
}


if (command === 'fianza') {
    message.reply(`**Fianza**
Para ser mm se pide una fianza como medida de seguridad, ya que funciona como una garantía en caso de que el MM intente realizar una estafa, permitiendo al servidor compensar a la víctima; una vez que el MM completa su primer trade de forma correcta y sin problemas, demuestra que es confiable y la fianza se le devuelve, dejando claro que no es un pago sino una garantía temporal para proteger a los usuarios y mantener la confianza en el sistema.`);
}

    if (command === 'stih') {
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
6- ¿Porqué desea ser middleman en este servidor?
7- ¿Que tipo de middleman desea ser, alto o bajo?`);

    }

if (command === 'kick') {

    if (!message.member.permissions.has('KickMembers')) {
        return message.reply("❌ No tienes permiso para usar este comando.");
    }

    const usuario = message.mentions.members.first();
    if (!usuario) {
        return message.reply("❌ Debes mencionar a un usuario.");
    }

    if (!usuario.kickable) {
        return message.reply("❌ No puedo expulsar a este usuario.");
    }

    const razon = args.slice(1).join(" ") || "Sin razón especificada";

    await usuario.kick(razon);

    message.channel.send(`👢 ${usuario.user.tag} fue expulsado.\n📄 Razón: ${razon}`);
}

if (command === 'ban') {

    if (!message.member.permissions.has('BanMembers')) {
        return message.reply("❌ No tienes permiso.");
    }

    const usuario = message.mentions.members.first();
    if (!usuario) {
        return message.reply("❌ Debes mencionar a un usuario.");
    }

    const razon = args.slice(1).join(" ");
    if (!razon) {
        return message.reply("❌ Debes proporcionar una razón.");
    }

    if (!usuario.bannable) {
        return message.reply("❌ No puedo banear a este usuario.");
    }

    await usuario.ban({ reason: razon });

    const embed = new EmbedBuilder()
        .setTitle("🔨 Usuario Baneado")
        .setColor("Red")
        .addFields(
            { name: "👤 Usuario", value: `${usuario.user.tag} (${usuario.id})` },
            { name: "🛡 Moderador", value: `${message.author.tag}` },
            { name: "📄 Razón", value: razon }
        )
        .setThumbnail(usuario.user.displayAvatarURL())
        .setTimestamp();

   const banLogChannel = message.guild.channels.cache.get(1475934904729473166);
if (banLogChannel) banLogChannel.send({ embeds: [embed] });

    message.channel.send(`✅ ${usuario.user.tag} fue baneado.`);
}

if (command === 'unban') {

    if (!message.member.permissions.has('BanMembers')) {
        return message.reply("❌ No tienes permiso.");
    }

    const userId = args[0];
    if (!userId) {
        return message.reply("❌ Debes proporcionar la ID del usuario.");
    }

    const razon = args.slice(1).join(" ");
    if (!razon) {
        return message.reply("❌ Debes proporcionar una razón.");
    }

    try {
        const bannedUser = await message.guild.bans.fetch(userId);

        await message.guild.members.unban(userId, razon);

        const embed = new EmbedBuilder()
            .setTitle("🔓 Usuario Desbaneado")
            .setColor("Green")
            .addFields(
                { name: "👤 Usuario", value: `${bannedUser.user.tag} (${userId})` },
                { name: "🛡 Moderador", value: `${message.author.tag}` },
                { name: "📄 Razón", value: razon }
            )
            .setThumbnail(bannedUser.user.displayAvatarURL())
            .setTimestamp();

        const unbanLogChannel = message.guild.channels.cache.get(1475935581379887348);
        if (unbanLogChannel) unbanLogChannel.send({ embeds: [embed] });

        message.channel.send(`✅ ${bannedUser.user.tag} fue desbaneado.`);

    } catch (error) {
        message.reply("❌ Ese usuario no está baneado o la ID es inválida.");
    }
}

if (command === 'warn') {

    if (!message.member.permissions.has('KickMembers')) {
        return message.reply("❌ No tienes permiso.");
    }

    const usuario = message.mentions.members.first();
    if (!usuario) {
        return message.reply("❌ Debes mencionar a un usuario.");
    }

    const razon = args.slice(1).join(" ");
    if (!razon) {
        return message.reply("❌ Debes proporcionar una razón.");
    }

    const embed = new EmbedBuilder()
        .setTitle("⚠ Usuario Advertido")
        .setColor("Yellow")
        .addFields(
            { name: "👤 Usuario", value: `${usuario.user.tag} (${usuario.id})` },
            { name: "🛡 Moderador", value: `${message.author.tag}` },
            { name: "📄 Razón", value: razon }
        )
        .setThumbnail(usuario.user.displayAvatarURL())
        .setTimestamp();

    const warnLogChannel = message.guild.channels.cache.get(WARN_LOG_CHANNEL_ID);
    if (warnLogChannel) {
        warnLogChannel.send({ embeds: [embed] });
    }

    message.channel.send(`⚠ ${usuario.user.tag} fue advertido.\n📄 Razón: ${razon}`);
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
                label: 'MM Profesional',
                value: 'mm_profesional',
                emoji: { id: "1472139948147871777" }
            },
            {
                label: 'MM Experienciado',
                value: 'mm_experienciado',
                emoji: { id: "1472141226898886657" }
            },
	    {
		label: 'MM Iniciante',
                value: 'mm_iniciante',
                emoji: { id: "1472138906961969247" }
            },
	    {
		label: 'Auth MM',
                value: 'mm_auth',
                emoji: { id: "1472140615847514305" }
	    }
 	]);

    const row = new ActionRowBuilder().addComponents(menu);

    message.channel.send({
        embeds: [embed],
        components: [row]
    });
}
});

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
        },
        ...STAFF_ROLES.map(roleId => ({
            id: roleId,
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ],
        }))
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

const menciones = STAFF_ROLES.map(id => `<@&${id}>`).join(" ");

            await canal.send({
                content: `${menciones} ${interaction.user}`,
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

    // ❌ Si ya fue reclamado
    if (interaction.channel.topic) {
        return interaction.reply({
            content: "❌ Este ticket ya fue reclamado.",
            ephemeral: true
        });
    }

    // ✅ Guardar quién lo reclamó
    await interaction.channel.setTopic(interaction.user.id);

    // ✅ Cambiar nombre del canal
    await interaction.channel.setName(`ticket-reclamado-${interaction.user.username}`);

    // ✅ Crear nuevos botones
    const nuevosBotones = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('reclamar_ticket')
            .setLabel('Reclamado')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),

        new ButtonBuilder()
            .setCustomId('cerrar_ticket')
            .setLabel('Cerrar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒')
    );

    // ✅ Actualizar botones
    await interaction.update({
        components: [nuevosBotones]
    });

    // ✅ Avisar en el canal
    await interaction.channel.send(`📌 Ticket reclamado por ${interaction.user}`);
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
