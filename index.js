/* eslint-disable no-console */
import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then((response) => response.json())
    .then((data) => `${data[0].q} -${data[0].a}`);
}

// Create a new client instance.
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once).
client.once('ready', async () => {
  console.log('Ready!');
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content === '!inspire') {
    getQuote().then((quote) => message.channel.send(quote));
  }

  if (message.content.startsWith('!slap ')) {
    let arg = message.content.split('!slap ')[1];

    if (arg === 'someone') {
      arg = await message.guild.members.fetch().catch(console.error);
    }

    console.log(arg);
    message.channel.send(`${message.author} slapped ${arg} :wave:`);
  }

  if (message.content.startsWith('!punch ')) {
    const arg = message.content.split('!punch ')[1];
    message.channel.send(`${message.author} punched ${arg} :punch:`);
  }
});

// Login to Discord with your client's token.
client.login(process.env.TOKEN);
