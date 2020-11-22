const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let emojiisim = args[0];
    const emoji = (message.guild.emojis.find("name", `${emojiisim}`))
    if (!emojiisim) return message.channel.send("Emoji ismi belirtmediniz")
    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setThumbnail(`${emoji.url}`)
    .addField("Emoji ismi", `${emojiisim}`)
    .addField("Emoji ID", `${emoji.id}`)
    .addField("Emoji Link", `${emoji.url}`)
    .setTimestamp()
    message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['emojiinfo'],
    permLevel: 0
}

exports.help = {
    name: 'e',
    description: 'İsmini yazdığınız emoji hakkında bilgi verir',
    usage: 'e'
}