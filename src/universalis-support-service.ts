import * as Discord from "discord.js";
import * as Winston from "winston";

import { messageReactionAddRemove } from "./events/messageReactionAddRemove";
import { ReactionAction } from "./types/ReactionAction";

const { token } = require("config.json");

const client = new Discord.Client(token);
global.logger = Winston.createLogger({
    level: "info",
    format: Winston.format.colorize(),
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({
            filename: "error.log",
            level: "error",
        }),
    ],
});

client.login()
.then(() => {
    global.logger.info(`Logged in as ${client.user.username}!`);

    client.on("messageReactionAdd", async (messageReaction, user) => {
        await messageReactionAddRemove(client, messageReaction, user, ReactionAction.Added);
    });

    client.on("messageReactionRemove", async (messageReaction, user) => {
        await messageReactionAddRemove(client, messageReaction, user, ReactionAction.Removed);
    });
});