const variable = require('../variable.js');
const Discord = require('discord.js');

module.exports = async function (message, traveller, exp, result_embed){
    var next_level = traveller.lvl*variable.NEXT_LEVEL_EXP;
    traveller.exp += exp;

    // traveller level up
    if (traveller.exp >= next_level) {
        stats_list = '';
        new_lvl = traveller.lvl
        new_atk = traveller.atk;
        new_hp = traveller.hp;
        new_def = traveller.def;

        // keep level up if have excess exp
        while (traveller.exp >= next_level) {
            // upgrade stats
            new_lvl = new_lvl+1;
            new_atk = Math.floor(new_atk * (1 + (variable.ARTIFACT_ATK/200)));
            new_hp = Math.floor(new_hp * (1 + (variable.ARTIFACT_HP/200)));
            new_def = Math.floor(new_def * (1 + (variable.ARTIFACT_DEF/200)));

            traveller.exp = traveller.exp - next_level;
            next_level = new_lvl*variable.NEXT_LEVEL_EXP;
        }

        // upgrade message
        stats_list += `\n\`LEVEL: ${traveller.lvl} -> ${new_lvl}\``;
        stats_list += `\n\`ATK: ${traveller.atk} -> ${new_atk}\``;
        stats_list += `\n\`HP: ${traveller.hp} -> ${new_hp}\``;
        stats_list += `\n\`DEF: ${traveller.def} -> ${new_def}\``;

        // update stats
        traveller.lvl = new_lvl;
        traveller.atk = new_atk;
        traveller.hp = new_hp;
        traveller.def = new_def;

        // send update embeds
        const copy_result_embed = result_embed[0];
        const new_result_embed = new Discord.MessageEmbed(copy_result_embed)
        .setColor('FFD700')
        .addField('Level up!:' , stats_list);

        message.channel.send({ embeds: [new_result_embed] });
    }

    return traveller;
}