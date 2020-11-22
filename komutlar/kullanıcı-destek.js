const Discord = require('discord.js');


exports.run = function(client, message, args) {
    let type = args.slice(0).join(' ');
    if (type.length < 1) return message.channel.send(
new Discord.RichEmbed()
.setDescription('Kullanım: =destek <mesaj>'));
const embed = new Discord.RichEmbed()
.setColor('ORANGE')
.setDescription('Destek Mesajınız Destek Kanalına Gönderilmiştir Teşekkür Ederiz <a:ok:709734233232638072> ')
message.channel.send(embed)
const embed2 = new Discord.RichEmbed()
.setColor("GREEN")
.setDescription(`**${message.author.tag}** adlı kullanıcının Destek Mesajı`)
.addField(`Kulanıcı Bilgileri`, `Kullanıcı ID: ${message.author.id}\nKullanıcı Adı: ${message.author.username}\nKullanıcı Tagı: ${message.author.discriminator}`)
.addField("Destek Mesajı", type)
.setThumbnail(message.author.avatarURL)
client.channels.get('766649764761829418').send(embed2); // Kanal ID 

};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: [],
  permLevel: 0 
};

exports.help = {
  name: 'destek',
  description: 'Bot için destek mesajı atarsınız',
  usage: 'destek <mesaj>'
};