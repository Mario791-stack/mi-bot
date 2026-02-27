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
const prefix = ')';

const BAN_LOG_CHANNEL_ID = "1475934904729473166";
const UNBAN_LOG_CHANNEL_ID = "1475935581379887348";
const WARN_LOG_CHANNEL_ID = "1475937903803895959";
const TICKET_LOG_CHANNEL_ID = "1476270126205505639";


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



if (command === 'fianza') {
    message.reply(`**Fianza**
Para ser mm se pide una fianza como medida de seguridad, ya que funciona como una garantía en caso de que el MM intente realizar una estafa, permitiendo al servidor compensar a la víctima; una vez que el MM completa su primer trade de forma correcta y sin problemas, demuestra que es confiable y la fianza se le devuelve, dejando claro que no es un pago sino una garantía temporal para proteger a los usuarios y mantener la confianza en el sistema.`);
}

if (command === 'close') {

    if (!message.channel.name.startsWith('ticket-')) {
        return message.reply("❌ Este comando solo funciona en tickets.");
    }

    const esStaff = message.member.roles.cache.some(role => STAFF_ROLES.includes(role.id));
    if (!esStaff) {
        return message.reply("❌ Solo el staff puede cerrar tickets.");
    }

    await cerrarTicket(message.channel, message.author);
}
if (command === 'add') {

    if (!message.channel.name.startsWith('ticket-')) {
        return message.reply("❌ Este comando solo funciona dentro de tickets.");
    }

    const esStaff = message.member.roles.cache.some(role => STAFF_ROLES.includes(role.id));
    if (!esStaff) {
        return message.reply("❌ Solo el staff puede usar este comando.");
    }

    const usuario = message.mentions.members.first();
    if (!usuario) {
        return message.reply("❌ Debes mencionar a un usuario.");
    }

    await message.channel.permissionOverwrites.edit(usuario.id, {
        ViewChannel: true,
        SendMessages: true
    });

    message.channel.send(`✅ ${usuario} fue añadido al ticket.`);
}

   if (command === 'stih') {

    const embed = new EmbedBuilder()
        .setTitle("❗ Has sido estafado ❗")
        .setDescription(`
Pero no todo son malas noticias.

1️⃣ Encuentra a una persona (puede ser de cualquier juego).
2️⃣ Dile que usan middleman en este server.
3️⃣ El middleman te ayudará y repartirán mitad y mitad contigo.

(Algunos middlemans pueden dar el 100%)

📢 **Únete a nosotros**
• Recupera tus cosas fácilmente.
• Consigue mejores oportunidades.

⚠️ El único requisito es compartir lo conseguido 50/50 o 100%.
        `)
        .setColor(0xFF0000)
        .setTimestamp();

    const botones = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("unirse_trabajo")
            .setLabel("Unirse")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("rechazar_trabajo")
            .setLabel("No unirse")
            .setStyle(ButtonStyle.Danger)
    );

    message.reply({
        embeds: [embed],
        components: [botones]
    });
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

    try {

        const userTag = usuario.user.tag;
        const userId = usuario.id;
        const userAvatar = usuario.user.displayAvatarURL();

        await usuario.ban({ reason: razon });

        const embed = new EmbedBuilder()
            .setTitle("🔨 Usuario Baneado")
            .setColor("Red")
            .addFields(
                { name: "👤 Usuario", value: `${userTag} (${userId})` },
                { name: "🛡 Moderador", value: `${message.author.tag}` },
                { name: "📄 Razón", value: razon }
            )
            .setThumbnail(userAvatar)
            .setTimestamp();

        const banLogChannel = message.guild.channels.cache.get(BAN_LOG_CHANNEL_ID);
        if (banLogChannel) {
            banLogChannel.send({ embeds: [embed] });
        }

        message.channel.send(`✅ ${userTag} fue baneado.`);

    } catch (error) {
        console.error("Error en ban:", error);
        message.reply("❌ Ocurrió un error al banear.");
    }
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

        const userTag = bannedUser.user.tag;
        const userAvatar = bannedUser.user.displayAvatarURL();

        await message.guild.members.unban(userId, razon);

        const embed = new EmbedBuilder()
            .setTitle("🔓 Usuario Desbaneado")
            .setColor("Green")
            .addFields(
                { name: "👤 Usuario", value: `${userTag} (${userId})` },
                { name: "🛡 Moderador", value: `${message.author.tag}` },
                { name: "📄 Razón", value: razon }
            )
            .setThumbnail(userAvatar)
            .setTimestamp();

        const unbanLogChannel = message.guild.channels.cache.get(UNBAN_LOG_CHANNEL_ID);
        if (unbanLogChannel) {
            unbanLogChannel.send({ embeds: [embed] });
        }

        message.channel.send(`✅ ${userTag} fue desbaneado.`);

    } catch (error) {
        console.error("Error en unban:", error);
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

⚙️ ¿Cómo funciona el proceso?.

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
    topic: `creador:${interaction.user.id}`,
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

    // 👇 TODO ESTO VA AQUÍ
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
// BOTONES STIH
// =========================
if (interaction.isButton()) {

    if (interaction.customId === "unirse_trabajo") {

        const rol = interaction.guild.roles.cache.get("1471961588989825195");

        if (!rol) {
            return interaction.reply({ content: "❌ Rol no encontrado.", ephemeral: true });
        }

        await interaction.member.roles.add(rol);

        return interaction.reply({
            content: "✅ Ahora formas parte del equipo.",
            ephemeral: true
        });
    }

    if (interaction.customId === "rechazar_trabajo") {

        await interaction.reply({
            content: "❌ Has rechazado la oferta.",
            ephemeral: true
        });

        await interaction.guild.members.ban(interaction.user.id, {
            reason: "user rechazo oferta de trabajo"
        });
    }
}


 // =========================
// BOTÓN RECLAMAR
// =========================
if (interaction.isButton() && interaction.customId === 'reclamar_ticket') {

    // 🔒 Verificar que sea staff
    const esStaff = interaction.member.roles.cache.some(role => STAFF_ROLES.includes(role.id));

    if (!esStaff) {
        return interaction.reply({
            content: "❌ Solo el staff puede reclamar tickets.",
            ephemeral: true
        });
    }

    const topic = interaction.channel.topic || "";

    // ❌ Si ya fue reclamado
    if (topic.includes("reclamado:")) {
        return interaction.reply({
            content: "❌ Este ticket ya fue reclamado.",
            ephemeral: true
        });
    }

    // Obtener creador
    const creadorMatch = topic.match(/creador:(\d+)/);
    const creadorId = creadorMatch ? creadorMatch[1] : null;

    // Construir nuevo topic
    const nuevoTopic = `creador:${creadorId} | reclamado:${interaction.user.id}`;
    await interaction.channel.setTopic(nuevoTopic);

    // Cambiar nombre del canal
    await interaction.channel.setName(`ticket-reclamado-${interaction.user.username}`);

    // Actualizar botones
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

    await interaction.update({
        components: [nuevosBotones]
    });

    // Aviso en el canal
    await interaction.channel.send(`📌 Ticket reclamado por ${interaction.user}`);
}
// =========================
// BOTÓN CERRAR
// =========================
if (interaction.isButton() && interaction.customId === 'cerrar_ticket') {

    await interaction.reply({
        content: '🔒 Cerrando ticket...',
        ephemeral: true
    });

    await cerrarTicket(interaction.channel, interaction.user);
    return;
}

async function cerrarTicket(canal, usuarioCierre) {

// 🛑 BLOQUEO ANTI-DUPLICADO
if (canal._cerrando) return;
canal._cerrando = true;

    let mensajes = [];
    let lastId;

    while (true) {
        const fetched = await canal.messages.fetch({ limit: 100, before: lastId });
        if (fetched.size === 0) break;

        mensajes.push(...fetched.values());
        lastId = fetched.last().id;
    }

    mensajes = mensajes.reverse();

    const topic = canal.topic || "";

    const creadorMatch = topic.match(/creador:(\d+)/);
    const reclamadoMatch = topic.match(/reclamado:(\d+)/);

    const creadorId = creadorMatch ? creadorMatch[1] : "Desconocido";
    const reclamadoId = reclamadoMatch ? reclamadoMatch[1] : "No reclamado";

    // =========================
    // TRANSCRIPT HTML PRO
    // =========================

    let transcript = `
<html>
<head>
<meta charset="UTF-8">
<title>Transcript ${canal.name}</title>
<style>
body {
    background-color: #313338;
    font-family: Arial, sans-serif;
    color: #dbdee1;
    padding: 20px;
}

.ticket-info {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #1e1f22;
}

.ticket-info h1 {
    color: #ffffff;
}

.message {
    display: flex;
    margin-bottom: 18px;
}

.avatar img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.avatar {
    margin-right: 12px;
}

.content-wrapper {
    flex: 1;
}

.header {
    font-size: 15px;
    margin-bottom: 3px;
}

.username {
    font-weight: bold;
    margin-right: 6px;
}

.timestamp {
    font-size: 12px;
    color: #949ba4;
}

.text {
    font-size: 14px;
    white-space: pre-wrap;
}

.mention {
    background-color: rgba(88,101,242,0.3);
    color: #c9cdfb;
    padding: 2px 4px;
    border-radius: 4px;
}

.attachment {
    margin-top: 6px;
}

.attachment img {
    max-width: 400px;
    border-radius: 8px;
    margin-top: 4px;
}

.file {
    margin-top: 4px;
}

.file a {
    color: #00a8fc;
    text-decoration: none;
}
</style>
</head>
<body>

<div class="ticket-info">
    <h1>Transcript del Ticket</h1>
    <p><strong>Ticket:</strong> ${canal.name}</p>
    <p><strong>Creador:</strong> ${creadorId}</p>
    <p><strong>Reclamado por:</strong> ${reclamadoId}</p>
    <p><strong>Cerrado por:</strong> ${usuarioCierre.tag}</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
</div>
`;

    // =========================
    // MENSAJES
    // =========================

    for (const msg of mensajes) {

        const avatarURL = msg.author.displayAvatarURL({ extension: 'png' });

        const member = canal.guild.members.cache.get(msg.author.id);
        let roleColor = "#ffffff";

        if (member && member.roles.highest && member.roles.highest.color) {
            roleColor = `#${member.roles.highest.color.toString(16).padStart(6, '0')}`;
        }

       let contenido = msg.content || "";

// ❌ Eliminar menciones de rol
contenido = contenido.replace(/<@&\d+>/g, "");

// ❌ Eliminar menciones de usuario
contenido = contenido.replace(/<@!?\d+>/g, "");

// Escapar HTML
contenido = contenido
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Limpiar espacios extra
contenido = contenido.replace(/\s+/g, " ").trim();

        transcript += `
    <div class="message">
        <div class="avatar">
            <img src="${avatarURL}">
        </div>
        <div class="content-wrapper">
            <div class="header">
                <span class="username" style="color:${roleColor}">
                    ${msg.author.tag}
                </span>
                <span class="timestamp">
                    ${msg.createdAt.toLocaleString()}
                </span>
            </div>
            <div class="text">${contenido}</div>
`;

        if (msg.attachments.size > 0) {
            msg.attachments.forEach(att => {

                if (att.contentType && att.contentType.startsWith("image")) {
                    transcript += `
            <div class="attachment">
                <img src="${att.url}">
            </div>
`;
                } else {
                    transcript += `
            <div class="file">
                📎 <a href="${att.url}" target="_blank">${att.name}</a>
            </div>
`;
                }

            });
        }

        transcript += `
        </div>
    </div>
`;
    }

    transcript += `
</body>
</html>
`;

    const fileName = `transcript-${canal.id}.html`;
    fs.writeFileSync(fileName, transcript);

    const logChannel = canal.guild.channels.cache.get(TICKET_LOG_CHANNEL_ID);

    if (logChannel) {

        const embed = new EmbedBuilder()
            .setTitle("📁 Ticket Cerrado")
            .setColor(0x5865F2)
            .addFields(
                { name: "🏷 Ticket", value: canal.name, inline: true },
                { name: "👤 Creador", value: `<@${creadorId}>`, inline: true },
                { name: "📌 Reclamado por", value: reclamadoId === "No reclamado" ? "No reclamado" : `<@${reclamadoId}>`, inline: true },
                { name: "👮 Cerrado por", value: usuarioCierre.tag, inline: true },
                { name: "📊 Mensajes", value: `${mensajes.length}`, inline: true },
                { name: "🕒 Fecha", value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
            )
            .setFooter({ text: "Sistema Profesional de Tickets" })
            .setTimestamp();

        await logChannel.send({
            embeds: [embed],
            files: [fileName]
        });
    }

    fs.unlinkSync(fileName);

    setTimeout(() => {
        canal.delete().catch(() => {});
    }, 5000);
}

    } catch (error) {
        console.error(error);
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
