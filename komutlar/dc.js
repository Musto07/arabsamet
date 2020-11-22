const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let emojiisim = args[0];
    
    const embed = new Discord.RichEmbed()
    .setColor("#CC7900")
    .setTitle('c5NN denen kardeş')
   
    	.addField('Sen Hayırdır?', 'Tek başıma bot olarak alırım 2 nizi', true)
       .setFooter('Atkansa -Kraliyet - BOT || Sametin Emrindeyiz...')
    .setTimestamp();
    message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['saldır'],
    permLevel: 0
}

exports.help = {
    name: 'saldır',
    description: 'İsmini yazdığınız emoji hakkında bilgi verir',
    usage: 'saldır'
}