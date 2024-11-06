import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji } from './utils.js';
import { plotRollResult } from './utils.js';
import { plotRollBonus } from './utils.js';
import { plotRollEmoji } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    /*// "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world ${getRandomEmoji()}`,
        },
      });
    }*/
    
    //"plot_die command", just rolls a Plot Die
    if (name === 'plot_die') {
       //The raw roll of the plot die, from 1 to 6
      const plotRoll = (Math.floor(Math.random() * 6) + 1);
      
      const plotResult = plotRollResult(plotRoll);
      
          // Send the diceroll  into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: plotResult,
        },
      });
    }
    
    // "plot_roll command", rolls 1d20 + n  and the Plot Die
    if (name === 'plot_roll') {
      
      // The modifier n that is added to the roll
      const modifier = req.body.data.options[0].value;
      
      //tracks opportunities and complications gained.
      
      //The raw roll of the 1d20, from 1 to 20
      const d20 = (Math.floor(Math.random() * 20) +1);
      
      var d20bonus = "";
      if (d20 === 20) { d20bonus = ", **Opportunity!**";}
      else if (d20 === 1) { d20bonus = ", **Complication!**";}
      
      //The raw roll of the plot die, from 1 to 6
      const plotRoll = (Math.floor(Math.random() * 6) + 1);
      
      const plotResult = plotRollResult(plotRoll);
      const plotBonus = plotRollBonus(plotRoll);
      
      //The end result of the roll, with bonuses from the modifier and the plot die
      const finalRoll = d20 + modifier + plotBonus;
      
      var msg = "[" + d20 + "] 1d20" + d20bonus + "\n" + plotResult +"\n\n` " + finalRoll + " ` <--- [" + d20 + "] ";
      if (plotBonus === 0 && modifier >= 0) {
        msg = msg + "+ " +  modifier;  
      } else if (plotBonus === 0) {
        msg = msg + "- " + Math.abs(modifier);  
      } else if (modifier >= 0) {
        msg = msg + "+ " + modifier + " + " + plotBonus; 
      } else {
        msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus; 
      }
        
      // Send the diceroll  into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: msg,
        },
      });
    }
    
    
        // "advantage_roll command, rolls 2d20 keep-highest + n  and the Plot Die
    if (name === 'advantage_roll') {
      
      // The modifier n that is added to the roll
      const modifier = req.body.data.options[0].value;
      
      //Which dice are to be rolled twice. can be 'd20', 'plot', or 'both'
      const which_adv = req.body.data.options[1].value;
      
      // the final message to send out
      var msg;
      var betterD20; //the better d20 roll, or the only d20 roll if the d20 isn't advantaged.
      
      
      //handles the d20 roll/s , depending on if there is an advantage to it or not
      if (which_adv === 'd20' || which_adv === 'both' ) {
          //The raw roll of the 2d20, from 1 to 20
          const firstD20 = (Math.floor(Math.random() * 20) +1);
          const secondD20 = (Math.floor(Math.random() * 20) +1);
          
          betterD20 = Math.max(firstD20, secondD20);
          const worseD20 = Math.min(firstD20, secondD20);
          
          var d20bonus = "";
          if (betterD20 === 20) { d20bonus = ", **Opportunity!**";}
          else if (betterD20 === 1) { d20bonus = ", **Complication!**";}
      
          msg = "[" + betterD20 + ", ~~" + worseD20 + "~~] 2d20 Keep-Higher"+ d20bonus + "\n";
      } else {
          // No multiple rolls, since the d20 isnt advantaged.
          //The raw roll of the 1d20, from 1 to 20
          betterD20 = (Math.floor(Math.random() * 20) +1);
          
          var d20bonus = "";
          if (betterD20 === 20) { d20bonus = ", **Opportunity!**";}
          else if (betterD20 === 1) { d20bonus = ", **Complication!**";}
          
          msg = "[" + betterD20 + "] 1d20 "+ d20bonus + "\n";
      }
      
      
      // this block handles the plot die, depending on if there's an advantage or not
      // if there is no advantage, plotBonus1 is used by default
      var plotBonus1 = 0;
      var plotBonus2 = 0;
      
      //determines if the final line  needs two potential results to show off.
      var needsTwoResults;
      
      if (which_adv === 'plot' || which_adv === 'both') {
          const plot1 = (Math.floor(Math.random() * 6) + 1);
          const plot2 = (Math.floor(Math.random() * 6) + 1);
          
          const plotResult1 = plotRollResult(plot1);
          plotBonus1 = plotRollBonus(plot1);
          
          const plotResult2 = plotRollResult(plot2);
          plotBonus2 = plotRollBonus(plot2);
        
          // if the two plot die rolled the same face, we can roughly treat this like an ordinary plot roll.
          if (plotResult1 === plotResult2) {
              msg = msg + plotRollEmoji(plot1) + plotResult1 + "\n\n";
              needsTwoResults = false;
          } else {
              msg = msg + plotResult1 + " ==OR== " + plotResult2 + "\n\n";
              needsTwoResults = true;
          }
          
      } else {
          //The raw roll of the plot die, from 1 to 6
          const plotRoll = (Math.floor(Math.random() * 6) + 1);
          
          const plotResult = plotRollResult(plotRoll);
          plotBonus1 = plotRollBonus(plotRoll);
        
          msg = msg + plotResult + "\n\n";
          needsTwoResults = false;
      }
      
      // this block handles the final line of the message
      if (needsTwoResults) {
         //The end result of the possible rolls, with bonuses from the modifier and the plot die
          const finalRoll1 = betterD20 + modifier + plotBonus1;
          const finalRoll2 = betterD20 + modifier + plotBonus2;
          
          msg = msg + "` " + finalRoll1 + " ` <--- [" + betterD20 + "] ";
          if (plotBonus1 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus1 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus1; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus1; 
          }
          
          msg = msg + " ==OR== ` " + finalRoll2 + " ` <--- [" + betterD20 + "] ";
          if (plotBonus2 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus2 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus2; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus2; 
          }
      } else {
          //The end result of the roll, with bonuses from the modifier and the plot die
          const finalRoll = betterD20 + modifier + plotBonus1;
          
          msg = msg + "` " + finalRoll + " ` <--- [" + betterD20 + "] ";
          if (plotBonus1 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus1 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus1; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus1; 
          }
          
      }
        
      // Send the diceroll  into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: msg,
        },
      });
    }
    
       // "disadvantage_roll command, rolls 2d20 keep-lowest + n  and the Plot Die
    if (name === 'disadvantage_roll') {
      
      // The modifier n that is added to the roll
      const modifier = req.body.data.options[0].value;
      
      //Which dice are to be rolled twice. can be 'd20', 'plot', or 'both'
      const which_disadv = req.body.data.options[1].value;
      
      // the final message to send out
      var msg;
      var worseD20; //the worse d20 roll, or the only d20 roll if the d20 isn't advantaged.
      
      
      //handles the d20 roll/s , depending on if there is an advantage to it or not
      if (which_disadv === 'd20' || which_disadv === 'both' ) {
          //The raw roll of the 2d20, from 1 to 20
          const firstD20 = (Math.floor(Math.random() * 20) +1);
          const secondD20 = (Math.floor(Math.random() * 20) +1);
          
          const betterD20 = Math.max(firstD20, secondD20);
          worseD20 = Math.min(firstD20, secondD20);
          
          var d20bonus = "";
          if (worseD20 === 20) { d20bonus = ", **Opportunity!**";}
          else if (worseD20 === 1) { d20bonus = ", **Complication!**";}
      
          msg = "[~~" + betterD20 + "~~, " + worseD20 + "] 2d20 Keep-Lower"+ d20bonus + "\n";
      } else {
          // No multiple rolls, since the d20 isnt advantaged.
          //The raw roll of the 1d20, from 1 to 20
          worseD20 = (Math.floor(Math.random() * 20) +1);
          
          var d20bonus = "";
          if (worseD20 === 20) { d20bonus = ", **Opportunity!**";}
          else if (worseD20 === 1) { d20bonus = ", **Complication!**";}
          
          msg = "[" + worseD20 + "] 1d20 "+ d20bonus + "\n";
      }
      
      
      // this block handles the plot die, depending on if there's an advantage or not
      // if there is no advantage, plotBonus1 is used by default
      var plotBonus1 = 0;
      var plotBonus2 = 0;
      
      //determines if the final line  needs two potential results to show off.
      var needsTwoResults;
      
      if (which_adv === 'plot' || which_adv === 'both') {
          const plot1 = (Math.floor(Math.random() * 6) + 1);
          const plot2 = (Math.floor(Math.random() * 6) + 1);
          
          const plotResult1 = plotRollResult(plot1);
          plotBonus1 = plotRollBonus(plot1);
          
          const plotResult2 = plotRollResult(plot2);
          plotBonus2 = plotRollBonus(plot2);
        
          // if the two plot die rolled the same face, we can roughly treat this like an ordinary plot roll.
          if (plotResult1 === plotResult2) {
              msg = msg + plotRollEmoji(plot1) + plotResult1 + "\n\n";
              needsTwoResults = false;
          } else {
              msg = msg + plotResult1 + " ==OR== " + plotResult2 + "\n\n";
              needsTwoResults = true;
          }
          
      } else {
          //The raw roll of the plot die, from 1 to 6
          const plotRoll = (Math.floor(Math.random() * 6) + 1);
          
          const plotResult = plotRollResult(plotRoll);
          plotBonus1 = plotRollBonus(plotRoll);
        
          msg = msg + plotResult + "\n\n";
          needsTwoResults = false;
      }
      
      // this block handles the final line of the message
      if (needsTwoResults) {
         //The end result of the possible rolls, with bonuses from the modifier and the plot die
          const finalRoll1 = worseD20 + modifier + plotBonus1;
          const finalRoll2 = worseD20 + modifier + plotBonus2;
          
          msg = msg + "` " + finalRoll1 + " ` <--- [" + worseD20 + "] ";
          if (plotBonus1 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus1 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus1; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus1; 
          }
          
          msg = msg + " ==OR== ` " + finalRoll2 + " ` <--- [" + worseD20 + "] ";
          if (plotBonus2 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus2 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus2; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus2; 
          }
      } else {
          //The end result of the roll, with bonuses from the modifier and the plot die
          const finalRoll = worseD20 + modifier + plotBonus1;
          
          msg = msg + "` " + finalRoll + " ` <--- [" + worseD20 + "] ";
          if (plotBonus1 === 0 && modifier >= 0) {
            msg = msg + "+ " +  modifier;  
          } else if (plotBonus1 === 0) {
            msg = msg + "- " + Math.abs(modifier);  
          } else if (modifier >= 0) {
            msg = msg + "+ " + modifier + " + " + plotBonus1; 
          } else {
            msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus1; 
          }
          
      }
        
      // Send the diceroll  into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: msg,
        },
      });
    }
    
    
    // "attack_roll command", rolls 1d20 + n  and the Plot Die
    if (name === 'attack_roll') {
      
      // The modifier n that is added to both the attack and damage rolls
      const modifier = req.body.data.options[0].value;
      
      //The amount and size of the damage die
      const dmgCount = req.body.data.options[1].value[0];
      const dmgSize = req.body.data.options[1].value[1];
      
      //tracks opportunities and complications gained.
      
      //The raw roll of the 1d20, from 1 to 20
      const d20 = (Math.floor(Math.random() * 20) +1);
      
      var d20bonus = "";
      if (d20 === 20) { d20bonus = ", **Opportunity!**";}
      else if (d20 === 1) { d20bonus = ", **Complication!**";}
      
      var msg = "[" + d20 + "] 1d20" + d20bonus + "\n";
      
      //The raw roll of the plot die, from 1 to 6
      const plotRoll = (Math.floor(Math.random() * 6) + 1);
      
      const plotResult = plotRollResult(plotRoll);
      const plotBonus = plotRollBonus(plotRoll);
      
      msg = msg + plotResult +"\n";
      
            //dmgRoll2 is only used in the case of dmgCount = 2
      var dmgRoll1;
      var dmgRoll2 = 0;
      
      //time for the damage roll!
      if (dmgSize === 0) {
        dmgRoll1 = 1;
        msg = msg + "[1] No Damage Roll\n\n";
      } else if (dmgCount === 1) {
        dmgRoll1 = (Math.floor*(Math.random) * dmgSize) +1;
        msg = msg + "[" + dmgRoll1 + "] 1d" + dmgSize + " Damage Roll\n\n";
      } else {
        dmgRoll1 = (Math.floor*(Math.random) * dmgSize) +1;
        dmgRoll2 = (Math.floor*(Math.random) * dmgSize) +1;
        msg = msg + "[" + dmgRoll1 + ", " + dmgRoll2 +  "] 2d" + dmgSize + " Damage Roll\n\n";
      }
      
      
      //The end result of the roll, with bonuses from the modifier and the plot die
      const finalRoll = d20 + modifier + plotBonus;
      
       msg = msg + "` " + finalRoll + " ` <--- [" + d20 + "] ";
      if (plotBonus === 0 && modifier >= 0) {
        msg = msg + "+ " +  modifier;  
      } else if (plotBonus === 0) {
        msg = msg + "- " + Math.abs(modifier);  
      } else if (modifier >= 0) {
        msg = msg + "+ " + modifier + " + " + plotBonus; 
      } else {
        msg = msg + "- " + Math.abs(modifier) + " + " + plotBonus; 
      }
      msg = msg + "\n"
      
      //Time for the final damage tally!
      const fullDmgRoll = dmgRoll1 + dmgRoll2;
      
      msg = msg + "[" + dmgRoll1 + ", " + dmgRoll2 +  "] 2d" + dmgSize + " + " + modifier + " ---> ` " + fullDmgRoll + " ` Damage if hit!";

        
      // Send the diceroll  into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: msg,
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
