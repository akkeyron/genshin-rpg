const variable = require('../variable.js');
const Discord = require('discord.js');

module.exports = {
    name: 'boss',
    //aliases
    description: 'Spend your resins to challenge the boss and rank up in the leaderboard!',
    async execute(client, message, args) {
        var user = message.author;
        const load_traveller_data = client.utils.get('load_traveller_data');
        const save_traveller_data = client.utils.get('save_traveller_data');
        const get_current_resin = client.utils.get('get_current_resin');
        const battle = client.utils.get('battle');

        // load traveller data  if any
        var traveller = await load_traveller_data(user);
        if (traveller == null) return console.log("You havent join the guild");
        traveller = await get_current_resin(traveller);

        // not enough resin
        if (traveller.resin < variable.BOSS_COST) {
            return message.channel.send(`You don't have enough resin. ${variable.BOSS_COST} resin required`);
        };

        // get boss data
        let boss_name = variable.BOSS_NAME[Math.floor(Math.random() * variable.BOSS_NAME.length)];
        var boss = {
            name: boss_name,
            atk: variable.BOSS_ATK_MULTIPLIER * traveller.rank,
            hp: variable.BOSS_HP_MULTIPLIER * traveller.rank,
            def: variable.BOSS_DEF_MULTIPLIER * traveller.rank,
            eva: variable.BOSS_EVASION
        }
        // get to the fight
        battle(client, message, traveller, boss, function(result) {
            const level_up = client.utils.get('level_up');
            var new_primo = 0;
            var new_mora = 0;
            var new_exp = 0;
            var status =  'You Lose';
            var color = 'FF0000';
            traveller.resin -= variable.BOSS_COST;

            // get reward
            if (result) {
                status =  'You Win and Ranked Up!';
                color = '7CFC00';
                traveller.rank += 1;
                new_primo = Math.floor(variable.PRIMO_BOSS_MULTIPLIER * traveller.rank);
                new_mora = Math.floor(variable.MORA_BOSS_MULTIPLIER * traveller.rank);
                new_exp = variable.BOSS_EXP_REWARD;
                traveller.primo += new_primo;
                traveller.mora += new_mora;
                traveller.exp += new_exp;
            }

            let reward_list = variable.MORA + `\`+${new_mora} mora\`\n`;
            reward_list += variable.PRIMO + `\`+${new_primo} primogems\`\n`;
            reward_list += variable.EXP + `\`+${new_exp} exp\`\n`;
            reward_list += variable.RESIN + `\`-${variable.BOSS_COST} resin\``;

            let result_status = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`${traveller.name} VS ${boss.name}`)
            .addField(status, reward_list)
            .addField('Resin remaining:', `${variable.RESIN}\`${traveller.resin}/300\``)
            msg_fight.edit( {embeds: [result_status]} );

            // check if traveller levels up
            traveller = level_up(message, traveller, new_exp);

            // save latest traveller data
            save_traveller_data(user, traveller);
        });
    }
}