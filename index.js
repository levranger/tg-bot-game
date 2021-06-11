require('dotenv').config();

const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./option')
const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9');
    const randomNumber = Math.floor(Math.random() * 10) + '';
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess' ,gameOptions)
}

const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Starting message' },
        { command: '/info', description: 'User info' },
        { command: '/game', description: 'Start the game' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/12.webp');
            return bot.sendMessage(chatId, 'Hello! My name is Lev!')

        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
                return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'I dont understand you idiot')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if ( data === '/again' ) {
           return  startGame(chatId);
        }

        if ( data === chats[chatId] ) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}!`, againOptions)
        }

       return   bot.sendMessage(chatId, `Ты выбрал неверный ответ, верный ответ - ${chats[chatId]} , and you chose ${data} `, againOptions)

    })

}
start();

