require('dotenv').config();
const ig = require('./instagram');
const {Telegraf} = require('telegraf')
const axios = require('axios');
const session = require('telegraf/session');
const bot = new Telegraf(process.env.TOKEN);
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base');
const instagram = require('./instagram');
const express = require('express');
const expressApp = express();
const { leave } = Stage
var s;

const URL = 'https://telfa-front.herokuapp.com'
const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.TOKEN || '';

console.log(`${API_TOKEN}-apitoken----------- ${process.env.PORT}-envtoken`);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
expressApp.use(bot.webhookCallback(`/bot${API_TOKEN}`));

// Greeter scene
const greeter = new Scene('greeter')
greeter.enter((ctx) => ctx.reply('Hi'))
greeter.leave((ctx) => ctx.reply('Bye'))
greeter.hears("leave", leave())
greeter.on('message', (ctx) => ctx.reply(ctx.session.bla + "and num" + s))

// Create scene manager
const stage = new Stage()
stage.command('cancel', leave())

// Scene registration
stage.register(greeter)

bot.use(session())
bot.use(stage.middleware())


let ready = false;
const welcomeMessage = "Hey, I'm Telfa! Send me your Instagram login and password, " +
    "After all write /done";

bot.start(async (ctx) => {


//    let res = await axios.post('https://telfo.herokuapp.com/authenticate', {
//        "username": "",
//        "password": ""})

//     console.log(res.data.jwt)

    // let final = await axios({
    //         method: 'get',
    //         url: 'https://telfo.herokuapp.com/test',
    //         headers: {
    //             "Authentication": `Bearer ${res.data.jwt}`
    //         }
    //     }
    // )
    // console.log(final)
    // if(ctx.session.jwt === undefined)
    //     return ctx.reply(welcomeMessage);
    // else

    return ctx.reply("Available commands: /start, /test")


});

bot.command("done", async ctx => {

    await ig.initialize();

    let isReady = await ig.login(user.username, user.password);

    if (isReady) {
        let res = await axios.post('https://telfo.herokuapp.com/user/add', user);
        return ctx.reply("Everything's fine!");
    } else
        return ctx.reply("Error :( Login or password was incorrect. \n Write /drop and try again.");


});

bot.command("drop", ctx => {

    ctx.session.bla = 1;
    s = 20;
    // user.username = "";
    // user.password = "";
    //
    // return ctx.reply("Dropped login and password")
});

bot.command("photo", async ctx => {
    await instagram.test();
    ctx.reply("Great!");
});


// bot.command('onetime', ({ reply }) =>
//     reply('One time keyboard', Markup
//         .keyboard(['/simple', '/inline', '/pyramid'])
//         .oneTime()
//         .resize()
//         .extra()
//     )
// )
//
// bot.command('special', (ctx) => {
//     return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
//         return markup.resize()
//             .keyboard([
//                 markup.contactRequestButton('Send contact'),
//                 markup.locationRequestButton('Send location')
//             ])
//     }))
// })


bot.hears('hi', async (ctx) => {
    await ctx.reply(`Hey, ${ctx.from.first_name}`);
});

bot.on('text', (ctx) => {

    if (ready && user.username === "")
        user.username = ctx.message.text;
    else if (ready && user.password === "")
        user.password = ctx.message.text;

    return ctx.reply('👍')
});

console.log(`${PORT}-apitoken----------- ${process.env.PORT}-envtoken`);

expressApp.get('/', (req, res) => {
    res.send('Hello World!');
  });
  expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

