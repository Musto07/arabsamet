const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const https = require("https");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
client.queue = new Map();

var prefix = ayarlar.prefix;

//----------------------Bot'un Bağlandı Kısmı -----------------------------//



const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("ready", () => {
  client.user.setGame(`=yardım | www.atkansa.com`, "https://www.twitch.tv/Atkansa");
        }, 
  console.log("Bağlandım!")
);

//----------------------Bot'un Bağlandı Kısmı SON-----------------------------//



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});



client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 4;
    if (message.author.id === ayarlar.sahip) permlvl = 5;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

///////////////////////---------------------------------Atkansa---------------------------//////////////////////////

client.on('message', msg => {
  if (msg.content.toLowerCase === '<@342408571084079104>') {
    msg.reply('Sahibime Ulaşmak İçin DM Kısmından Mesaj Atabilirsin Etiketlemek Yasak Anlayışınız İçin Teşekkürler.');
  }
});



///////////////////////---------------------------------Destek---------------------------//////////////////////////

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `destek-sistemi`)) {
    const embed = new Discord.RichEmbed()
    .setAuthor(`Samet Atkan`, client.user.avatarURL)
    .setFooter(`${message.author.tag} tarafından istendi.`, message.author.avatarURL)
    .setThumbnail(client.user.avatarURL)
    .setColor(0x00ffff)
    .setTitle(`Destek sistemi`)
    .setDescription(`Sunucunuzdaki üyler ile özel bir kanalda konuşmanızı \n yardım etmenizi sağlar. Nitekim destek talebi sistemi.`)
    .addField(`Ticket Komutları`, `**[${prefix}destekaç]()**: Destek Bildirimi Oluşturur! \n **[${prefix}destekkapat]()**: Ticket kapatır!`)
    message.channel.send({ embed: embed });
  }


if (message.content.toLowerCase().startsWith(prefix + `destekaç`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Atkansa Destek")) return message.channel.send(`Bu Sunucuda '**Musto Destek**' rolünü bulamadım bu yüzden ticket açamıyorum \nEğer sunucu sahibisen, Destek Ekibi Rolünü oluşturabilirsin.`);
    if (message.guild.channels.exists("name", "destektalebi-" + message.author.id)) return message.channel.send(`Zaten açık durumda bir ticketin var.`);
    message.guild.createChannel(`ticket-${message.author.tag}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Atkansa Destek");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: destek Kanalın oluşturuldu   , #${c.name}.`);
        const embed = new Discord.RichEmbed()
        .setColor(0xCF40FA)
        .addField(`Hey ${message.author.username}!`, `Başarılı bir şekilde destek açıldı .`)
      c.send(`<@${message.author.id}> Adlı kullanıcı  destek talebi açtı! Lütfen Destek Ekibini bekle, <@rolID>`)

        .setTimestamp();
        c.send({ embed: embed });
        message.delete();
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `destekkapat`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Bu komutu kullanamazsın ticket kanalında olman gerekir.`);

    message.channel.send(`Destek Kanalını kapatmaya emin misin? kapatmak için **${prefix}kapat** yazman yeterli.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '${prefix}kapat', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket Kapatma isteğin zaman aşımına uğradı.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}


});

///////////////////////---------------------------------reaksiyon---------------------------//////////////////////////
const events = {
        MESSAGE_REACTION_ADD: 'messageReactionAdd',
        MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};
 
client.on('raw', async event => {
        if (!events.hasOwnProperty(event.t)) return;
        const { d: data } = event;
        const anto = client.users.get(data.user_id);
        const channel = client.channels.get(data.channel_id) || await anto.createDM();
        if (channel.messages.has(data.message_id)) return;
        const message = await channel.fetchMessage(data.message_id);
        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        const reaction = message.reactions.get(emojiKey);
        client.emit(events[event.t], reaction, anto);
});
 
client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.id == "780089456291610635") {//Geçerli olması istediğiniz mesajın ID'sini yazabilirsiniz.
    if (reaction.emoji.name == "web") {//Dilediğini emojiyi koyabilirsiniz.
      reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find('name', 'Web'))//Dilediğiniz rolün adını yazabilirsiniz.
        }
        if (reaction.emoji.name == "win") {//Dilediğiniz emojiyi koyabilirsiniz.
          reaction.message.guild.members.get(user.id).addRole(reaction.message.guild.roles.find('name', 'Win'))//Dilediğiniz rolün adını yazabilirsiniz.
        }


  }
});
 
 
client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.id == "780089456291610635") {
          if (reaction.emoji.name == "web") {
                reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find('name', 'Web'))//Dilediğiniz rolün adını yazabilirsiniz.
          }
          if (reaction.emoji.name == "win") {
                reaction.message.guild.members.get(user.id).removeRole(reaction.message.guild.roles.find('name', 'Win'))//Dilediğiniz rolün adını yazabilirsiniz.
          }

        }
  });

///////////////////////---------------------------------reaksiyon---------------------------//////////////////////////

/*
setInterval(() => {
  client.channels.get("750029792354631710").send("**Welcome to CB-X | CB-X'e Hoş geldin**")
  client.channels.get("750029792354631710").send('https://streamable.com/2buhmd')
}, 20000) //20 saniyeye Esittir*/
client.login(ayarlar.token);
