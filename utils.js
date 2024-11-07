import 'dotenv/config';

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function plotRollResult(roll) {
    if (roll === 1) {
            return "<:cosmere_comp2:1302349866617274629> **Complication!** Bonus +2";
    } else if (roll === 2) {
            return "<:cosmere_comp4:1302349867875565599> **Complication!** Bonus +4";
    } else if (roll === 5 || roll === 6) {
            return "<:cosmere_opp:1302349870115459082> **Opportunity!**";
    } else {
            return  "<:cosmere_blank:1302349869318672395> Blank";
    }
}

export function plotRollEmoji(roll) {
    if (roll === 1) {
            return "<:cosmere_comp2:1302349866617274629>";
    } else if (roll === 2) {
            return "<:cosmere_comp4:1302349867875565599>";
    } else if (roll === 5 || roll === 6) {
            return "<:cosmere_opp:1302349870115459082>";
    } else {
            return  "<:cosmere_blank:1302349869318672395>";
    }
}

export function plotRollBonus(roll) {
    if (roll <= 2) {
      return roll * 2;
    } else {
      return 0;
    }
}

export function diceToPair(dice) {
  if (dice === '1') {
    return [1, 0];
  } else {
    const numbers = dice.split("d");
    return [ parseInt(numbers[0]) , parseInt(numbers[1]) ];
  }
}
