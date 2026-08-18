module.exports = function(bot, database, settings, consoleDisplay, userStates, helpers) {
    
    bot.onText(/\/reportacc/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'reportacc');
        
        if (!helpers.checkUserAccess(userId, chatId)) return;
        
        userStates[userId] = { state: 'waiting_reportacc_target' };
        
        bot.sendMessage(chatId,
            '📝 *REPORT ACCOUNT*\n\n' +
            'Please send the target link you want to report:\n\n' +
            'Example: https://t.me/username\n' +
            'or: @username\n\n' +
            '⚠️ *Important:* Target must be a Telegram account',
            { parse_mode: 'Markdown' }
        );
    });

    bot.onText(/\/reportch/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'reportch');
        
        if (!helpers.checkUserAccess(userId, chatId)) return;
        
        userStates[userId] = { state: 'waiting_reportch_target' };
        
        bot.sendMessage(chatId,
            '📝 *REPORT CHANNEL*\n\n' +
            'Please send the channel link you want to report:\n\n' +
            'Example: https://t.me/channelname\n' +
            'or: @channelname\n\n' +
            '⚠️ *Report will focus on:*\n' +
            '• Personal Data > Private Image',
            { parse_mode: 'Markdown' }
        );
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text;
        
        if (!text || text.startsWith('/')) return;
        
        const userState = userStates[userId];
        if (!userState) return;
        
        if (userState.state === 'waiting_reportacc_target') {
            userStates[userId] = {
                state: 'waiting_reportacc_reason',
                target: text
            };
            
            bot.sendMessage(chatId,
                '✅ *Target accepted!*\n\n' +
                'Now send the reason for the report:\n\n' +
                'Example: "Spam messages" or "Harassment"\n' +
                '⚠️ *Report will be made in:*\n' +
                '• Other',
                { parse_mode: 'Markdown' }
            );
            
        } else if (userState.state === 'waiting_reportacc_reason') {
            userStates[userId] = {
                state: 'waiting_reportacc_count',
                target: userState.target,
                reason: text
            };
            
            bot.sendMessage(chatId,
                '✅ *Reason accepted!*\n\n' +
                'Now send the number of reports (1-1000):\n\n' +
                'Example: 10\n' +
                '⚠️ *Note:* 2 second delay per report',
                { parse_mode: 'Markdown' }
            );
            
        } else if (userState.state === 'waiting_reportacc_count') {
            const count = parseInt(text);
            
            if (isNaN(count) || count < 1 || count > 1000) {
                bot.sendMessage(chatId, '❌ Count must be between 1-1000!');
                return;
            }
            
            delete userStates[userId];
            
            const accessResult = database.useAccess(userId);
            if (!accessResult.success && !database.isPremium(userId) && userId != settings.ownerId) {
                bot.sendMessage(chatId, '❌ Access exhausted!');
                return;
            }
            
            helpers.startReportProcess(chatId, userId, 'ACCOUNT', userState.target, userState.reason, count, accessResult.message);
            
        } else if (userState.state === 'waiting_reportch_target') {
            userStates[userId] = {
                state: 'waiting_reportch_reason',
                target: text
            };
            
            bot.sendMessage(chatId,
                '✅ *Channel target accepted!*\n\n' +
                'Now send the reason for the report:\n\n' +
                'Example: "Posting private images"\n' +
                '⚠️ *Report will focus on:*\n' +
                '• Personal Data > Private Image',
                { parse_mode: 'Markdown' }
            );
            
        } else if (userState.state === 'waiting_reportch_reason') {
            userStates[userId] = {
                state: 'waiting_reportch_count',
                target: userState.target,
                reason: text
            };
            
            bot.sendMessage(chatId,
                '✅ *Reason accepted!*\n\n' +
                'Now send the number of reports (1-1000):\n\n' +
                'Example: 10\n' +
                '⚠️ *Note:* 2 second delay per report',
                { parse_mode: 'Markdown' }
            );
            
        } else if (userState.state === 'waiting_reportch_count') {
            const count = parseInt(text);
            
            if (isNaN(count) || count < 1 || count > 1000) {
                bot.sendMessage(chatId, '❌ Count must be between 1-1000!');
                return;
            }
            
            delete userStates[userId];
            
            const accessResult = database.useAccess(userId);
            if (!accessResult.success && !database.isPremium(userId) && userId != settings.ownerId) {
                bot.sendMessage(chatId, '❌ Access exhausted!');
                return;
            }
            
            helpers.startReportProcess(chatId, userId, 'CHANNEL', userState.target, userState.reason, count, accessResult.message);
        }
    });
};