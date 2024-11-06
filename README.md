Sylphrena is a simple Discord dice-rolling bot built for use with the Cosmere RPG. It is based off the open-source [Discord Example App](https://github.com/discord/discord-example-app).

It currently focuses on rolls involving the Cosmere RPG's unique plot die, which is inconvient to emulate using conventional dice-rolling bots, and must therefore be paired up with a conventional dice-rolling bot. This may or may not be expanded upon in the future.

The Cosmere RPG is property of Brandon Sanderson and Brotherwise Games. Sylphrena is not affiliated with Brandon Sanderson, Brotherwise Games, or the Discord platform.

## Commands

`/plot_die`: Rolls a singular plot die and displays its result.
`/plot_roll <modifier>`: Rolls a standard skill check with a plot die, which consists of a 1d20 + a skill modifier and the plot die.
`/advantage_roll <modifier> <advantages>`: Like the above command, but the user can designate for the d20, the plot die, or both to be advantaged. An advantaged die is rolled twice and the better result is kept.
    - The "better result" of a plot die is often ambiguous. Thus, whenever the plot die is advantaged and the two rolls come up  on different faces, both potential results are shown for the player to choose.
`/disadvantage_roll <modifier> <disasvantages>`: Like the above command, but with disadvantages instead. A disadvantaged die is rolled twice and the worse result is kept.
    - For similar reasons, the same logic is used for disadvantaged plot die. The GM chooses their preferred result instead of the player.
`/plot_attack <modifier> <damage die>`: Rolls a standard attack, which consists of a 1d20, the plot die, and the damage die. The size and amount of damage dice is inputted by the user, and decided by the characters weapon. The modifier is added to both the 1d20 and the damage dice.

## Planned Features

- Allow the `/plot_die` command to roll multiple plot dice at once.

- Alter the plot-die logic of the advantage and disadvantage commands to filter out situations where the two plot die rolled different results, but one result is strictly better than the other.
    - This consists of (Blank and Opportunity) or (Complication +2 and Complication +4). In any case where one result is a Complication and the other is not, the "better result" is ambiguous.
    
- Add `/advantage_attack` and `/disadvantage_attack` commands. These must incorporate all the usual features of advantaged/disadvantaged rolls and the attack roll,  while also taking into accont that the damage die can be advantaged/disadvantaged.
    - The most troublesome edge case is that if a player has a weapon that rolls 2 damage dice, like a Shardblade, they can choose to apply two advantages to the damage dice, one for each dice. The command choices should allow for this, but also ensure that it is only selected if the damage dice actually are 2 in number.
    
## Installation

Prerequisites: git, Node.js, a Discord Application/Bot with permission to Send Messages and add Slash Commands, and some method of forwarding the Discord Bot's requests to `localhost:3000` on the machine hosting the program.

`git clone https://github.com/FakeSalamander/sylphrena`
`cd sylphrena`

Create a file called `.env` in this directory, and write the App Id, Discord Token, and Public Key of your Discord app into it as follows. These can be found in the Discord Developer Portal.

```
APP_ID=<your app id>
DISCORD_TOKEN=<your discord token>
PUBLIC_KEY=<your public key>
```

Then, run the following commands to start the program.

`npm run register`
`npm run start`

The register command only needs to be run once.
