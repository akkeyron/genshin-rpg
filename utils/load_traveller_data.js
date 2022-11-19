var AWS = require("aws-sdk");

// Use a DynamoDB Local endpoint
AWS.config.update({
    region: "Singapore",
    endpoint: "http://localhost:8080"
});

module.exports = async function (user, guildid) {
    return new Promise(function (resolve, reject) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        const params = {
            Key: {
                "guildid": guildid,
                "id": user.id
            },
            TableName: "Travellers",
        };

        // query the data
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to retrieve the data", err);
                resolve(null);
            }
            else if (data.Item) {
                resolve(data.Item.data);
            }
            else {
                resolve(null);
            }
        });
    })
};