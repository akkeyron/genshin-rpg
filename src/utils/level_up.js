const variable = require('../variable.js');
const { Discord, EmbedBuilder  } = require('discord.js');

module.exports = function (message, traveller){
    var next_level = traveller.lvl*variable.NEXT_LEVEL_EXP;

    // check if traveller level up
    if (traveller.exp < next_level) {
        return traveller;
    } else {
    // traveller level up
        stats_list = '';
        new_lvl = traveller.lvl
        new_atk = traveller.atk;
        new_hp = traveller.hp;
        new_def = traveller.def;

        // keep level up if have excess exp
        while (traveller.exp >= next_level) {
            // upgrade stats
            new_lvl = new_lvl+1;
            new_atk = Math.ceil(new_atk * (1 + variable.NEXT_LEVEL_ATK));
            new_hp = Math.ceil(new_hp * (1 + variable.NEXT_LEVEL_HP));
            new_def = Math.ceil(new_def * (1 + variable.NEXT_LEVEL_DEF));

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
        const new_result_embed = new EmbedBuilder()
        .setColor('FFD700')
        .addFields( 
            { name: `${traveller.name} leveled up!:` , value: stats_list}
        )

        message.channel.send({ embeds: [new_result_embed] });

        return traveller;
    }
}