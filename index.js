import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';
import cron from 'node-cron';
import { token, lobby } from './config.js';

async function getQuote() {
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
    const quote = await getQuote();
    console.log(quote);
    message.channel.send(quote);
  } else

  if (message.content.startsWith('!slap ')) {
    let arg = message.content.split('!slap ')[1];

    if (arg === 'someone') {
      arg = await message.guild.members.fetch().catch(console.error);
    }

    const msg = `${client.user} slapped ${arg} :wave:`;
    console.log(msg);
    message.channel.send(msg);
  } else

  if (message.content.startsWith('!punch ')) {
    const arg = message.content.split('!punch ')[1];
    const msg = `${client.user} punched ${arg} :punch:`;
    console.log(msg);
    message.channel.send(msg);
  }
});

// Login to Discord with your client's token.
await client.login(token);

const cronOptions = {
  scheduled: true,
  timezone: 'Asia/Karachi',
};

// Send morning meeting message to lobby.
cron.schedule('0 12 7 * * *', async () => {
  const msg = '**Morning Meeting** :bell:\n It\'s time to show yo faces to each other. You washed \'em yet? :face_with_raised_eyebrow: Gather \'round!';
  console.log(msg);
  client.channels.cache.get(lobby).send(msg);
}, cronOptions);

// Send quote of the day to lobby.
cron.schedule('10 12 7 * * *', async () => {
  const quote = await getQuote();
  const msg = `**Today's Quote** :feather:\n> ${quote}`;
  console.log(msg);
  client.channels.cache.get(lobby).send(msg);
}, cronOptions);

// Send lunch time message to lobby.
cron.schedule('15 12 7 * * *', async () => {
  const msg = '**Lunch Time** :fork_knife_plate:\n Hungry? It\'s time to eat food yo! :drooling_face:';
  console.log(msg);
  client.channels.cache.get(lobby).send(msg);
}, cronOptions);
