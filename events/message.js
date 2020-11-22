const ayarlar = require('../ayarlar.json');
const sure = 5 //Komut bekleme süresi
const beklememesaji = `Bu komutu kullanabilmek için \`${sure}\` Beklemelisin Sonra Yavaş Çalışıyorum` //Komut bekleme mesajı
const sahipbeklemesi = false //Sahip bekleme ayarı (false=kapalı, true=açık)
let yazma = new Set();

module.exports = message => {
  
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
    if (yazma.has(message.author.id)) {
      return message.channel.send(beklememesaji);
    }
  } else if (client.aliases.has(command)) {
    if (yazma.has(message.author.id)) {
      return message.channel.send(beklememesaji);
    }
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    if(sahipbeklemesi === false) {
      yazma.add(message.author.id);
    } if(sahipbeklemesi === true) {
      if(message.author.id === ayarlar.sahip) {
        cmd.run(client, message, params, perms);
        return true;
      }
    }
    setTimeout(() => {
      if(yazma.has(message.author.id)) {
        yazma.delete(message.author.id);
      }
    }, sure * 1000);
    cmd.run(client, message, params, perms);
  }

};