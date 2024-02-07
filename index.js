const TelegramApi = require('node-telegram-bot-api')
const token = '6881169637:AAFLXFm5z05Dl1M564Ap9l1CiQw8Si3Owb0'

const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions} = require('./options')

const chats ={}

const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, `Я загадал цыфру от 0-9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра'},
        {command: '/test', description: 'DEV'},
    ])
    
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start'){
            await bot.sendSticker(chatId, 'CAACAgIAAxkBAAMiZcJOmZIcYfL1YZl4Ye80s53_UYoAAlEmAALuUslJISn4Zms9qJU0BA');
            return bot.sendMessage(chatId, `Welcome to zarubin bot`)
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text === '/test') {
            return bot.sendMessage(chatId, `Test`)
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю`)   
    })
    
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if ( data == chats[chatId]){
            return bot.sendMessage(chatId, `Ты угадал, это цифра ${chats[chatId]}`, againOptions)   
        }
        return bot.sendMessage(chatId, `Не угадал, это цифра ${chats[chatId]}`, againOptions)   
    })
}   

start()