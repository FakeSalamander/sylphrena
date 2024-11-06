import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

/*
// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}
*/

/*
// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};
*/

const PLOTDIE_COMMAND = {
    name: 'plot_die',
    description: 'Rolls the 6-sided Cosmere RPG\'s Plot Die',
    type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
}

const PLOTROLL_COMMAND = {
  name: 'plot_roll',
  description: 'Make a typical 1d20 roll with a modifier and the plot die',
  options: [
    {
      type: 4,
      name: 'modifier',
      description: 'The modifier to your roll from your skill modifier and any bonuses/penalties',
      required: true,
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};


const ADVROLL_COMMAND = {
  name: 'advantage_roll',
  description: 'Make an advantageous roll with a modifier and the plot die',
  options: [
    {
      type: 4,
      name: 'modifier',
      description: 'The modifier to your roll from your skill modifier and any bonuses/penalties',
      required: true,
    },
    {
      type: 3,
      name: 'advantages',
      description: 'which dice are advantaged?',
      required: true,
      choices: [
        {name:'d20', value: 'd20'}, 
        {name:'plot', value: 'plot'}, 
        {name:'both', value: 'both'}
      ],
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const DISADVROLL_COMMAND = {
  name: 'disadvantage_roll',
  description: 'Make a disadvantageous  roll with a modifier and the plot die',
  options: [
    {
      type: 4,
      name: 'modifier',
      description: 'The modifier to your roll from your skill modifier and any bonuses/penalties',
      required: true,
    },
    {
      type: 3,
      name: 'disadvantages',
      description: 'which dice are disadvantaged?',
      required: true,
      choices: [
        {name:'d20', value: 'd20'}, 
        {name:'plot', value: 'plot'}, 
        {name:'both', value: 'both'}
      ],
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ATKROLL_COMMAND = {
  name: 'attack_roll',
  description: 'Make a typical 1d20 roll with a modifier and the plot die',
  options: [
    {
      type: 4,
      name: 'modifier',
      description: 'The modifier to your d20/damage rolls from your skill modifier and any bonuses/penalties',
      required: true,
    },
    {
      type: 3,
      name: 'damage die',
      description: 'The damage die of your weapon',
      required: true,
      choices: [
        {name:'1', value:[1, 0]}, 
        {name:'1d4', value:[1, 4]}, 
        {name:'1d6', value:[1, 6]}, 
        {name:'1d8', value:[1, 8]}, 
        {name:'1d10', value:[1, 10]}, 
        {name:'2d6', value:[2, 6]}, 
        {name:'2d8', value:[2, 8]}, 
        {name:'2d10', value:[2, 10]}
      ],
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};



const ALL_COMMANDS = [PLOTDIE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
