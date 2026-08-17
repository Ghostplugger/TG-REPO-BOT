module.exports = function(bot, database, settings, consoleDisplay, userStates, helpers, getStartMessage, getMenuMessage) {
    
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'start');
        
        const startMessage = getStartMessage(userId, userName);
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: startMessage,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📋 MENU', callback_data: 'show_menu' },
                        { text: '💤Xone', url: `https://t.me/${settings.dev}` }
                    ]
                ]
            }
        });
    });

    bot.onText(/\/menu/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        const status = helpers.getUserStatus(userId);
        
        consoleDisplay.logCommand(userId, userName, 'menu');
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: getMenuMessage(userId, userName, status),
            parse_mode: 'HTML'
        });
    });

    bot.on('callback_query', async (callbackQuery) => {
        const msg = callbackQuery.message;
        const userId = callbackQuery.from.id;
        const userName = callbackQuery.from.username || callbackQuery.from.first_name;
        const data = callbackQuery.data;
        const status = helpers.getUserStatus(userId);
        
        if (data === 'show_menu') {
            try {
                await bot.editMessageCaption(getMenuMessage(userId, userName, status), {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '🏠 HOME', callback_data: 'show_home' },
                                { text: '💤Xone', url: `https://t.me/${settings.dev}` }
                            ]
                        ]
                    }
                });
            } catch (error) {
                console.log('Error editing message:', error.message);
            }
        }
        
        if (data === 'show_home') {
            try {
                await bot.editMessageCaption(getStartMessage(userId, userName), {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '📋 MENU', callback_data: 'show_menu' },
                                { text: '💤Xone', url: `https://t.me/${settings.dev}` }
                            ]
                        ]
                    }
                });
            } catch (error) {
                console.log('Error editing message:', error.message);
            }
        }
        
        bot.answerCallbackQuery(callbackQuery.id);
    });

    bot.onText(/\/myprem/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'myprem');
        
        let statusMessage = '';
        
        if (userId == settings.ownerId) {
            statusMessage = `<blockquote>👑 OWNER STATUS</blockquote>
❤️‍🔥 Account Information:
<blockquote>👤 Name: ${userName}
🆔 ID: ${userId}
⭐ Status: Owner
👥 Premium Users: ${database.getPremiumUsers().length}
🎫 Access Users: ${database.getAccessUsers().length}</blockquote>`;
        } else if (database.isPremium(userId)) {
            const user = database.getPremiumUsers().find(u => u.id == userId);
            statusMessage = `<blockquote>⭐ PREMIUM USER</blockquote>
❤️‍🔥 Account Information:
<blockquote>👤 Name: ${userName}
🆔 ID: ${userId}
⭐ Status: Premium Active ✅
🎉 All Premium Features Unlocked</blockquote>`;
        } else if (database.hasAccess(userId)) {
            const access = database.getUserAccess(userId);
            statusMessage = `<blockquote>🎫 ACCESS USER</blockquote>
❤️‍🔥 Account Information:
<blockquote>👤 Name: ${userName}
🆔 ID: ${userId}
🎫 Access Remaining: ${access}
⚠️ Each report uses 1 access</blockquote>`;
        } else {
            statusMessage = `<blockquote>🔒 REGULAR USER</blockquote>
❤️‍🔥 Account Information:
<blockquote>👤 Name: ${userName}
🆔 ID: ${userId}
⭐ Status: Regular User</blockquote>
❤️‍🔥 Upgrade Info:
<blockquote>Contact @${settings.dev} for premium/access info</blockquote>`;
        }
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: statusMessage,
            parse_mode: 'HTML'
        });
    });

    bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'help');
        
        const helpMessage = `<blockquote>❓ HELP & SUPPORT</blockquote>
❤️‍🔥 Bot Information:
<blockquote>🤖 Bot Name: Telegram Auto Report
👑 Developer: @sneuo
📱 Version: 1.0.0
🔒 Status: Active</blockquote>
❤️‍🔥 How to Use:
<blockquote>1. Use /start to begin
2. Use /myprem to check status
3. Use /reportacc or /reportch to report
4. Contact @sneuo for assistance</blockquote>`;
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: helpMessage,
            parse_mode: 'HTML'
        });
    });
};