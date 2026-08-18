module.exports = function(bot, database, settings, consoleDisplay, helpers) {
    
    bot.onText(/\/access (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'access', match[1]);
        
        if (userId != settings.ownerId) {
            bot.sendMessage(chatId, '❌ *Access Denied!*\nOnly owner can use this command.', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        const args = match[1].split(' ');
        if (args.length < 2) {
            bot.sendMessage(chatId, '❌ *Wrong Format!*\nExample: /access 123456789 5', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        const targetId = parseInt(args[0]);
        const nominal = parseInt(args[1]);
        
        if (isNaN(targetId) || isNaN(nominal) || nominal < 1) {
            bot.sendMessage(chatId, '❌ *Invalid input!*\nID and nominal must be numbers.', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        try {
            bot.getChat(targetId).then(chat => {
                const targetUsername = chat.username || '';
                
                const addedAccess = database.addAccess(targetId, nominal, targetUsername);
                
                consoleDisplay.logAdminAction(userId, `ADD_ACCESS ${nominal}`, targetId);
                
                bot.sendMessage(targetId, 
                    `🎉 *ACCESS ADDED!*\n\n` +
                    `You got *${nominal} Access* from admin!\n\n` +
                    `✅ You can now use premium commands\n` +
                    `📊 Remaining Access: ${addedAccess}\n\n` +
                    `Use /myprem to check status`,
                    { parse_mode: 'Markdown' }
                ).catch(() => {
                    console.log('Cannot send notification to target');
                });
                
                bot.sendMessage(chatId, 
                    `✅ *Access added successfully!*\n\n` +
                    `👤 Target: ${targetId}\n` +
                    `🎫 Access: +${nominal}\n` +
                    `📊 Total: ${addedAccess}\n` +
                    `📅 Time: ${new Date().toLocaleString()}`,
                    { parse_mode: 'Markdown' }
                );
                
            }).catch(err => {
                database.addAccess(targetId, nominal, '');
                consoleDisplay.logAdminAction(userId, `ADD_ACCESS ${nominal}`, targetId);
                
                bot.sendMessage(chatId, 
                    `✅ *Access added successfully!*\n\n` +
                    `👤 Target: ${targetId}\n` +
                    `🎫 Access: +${nominal}\n` +
                    `📊 Total: ${nominal}\n` +
                    `📅 Time: ${new Date().toLocaleString()}`,
                    { parse_mode: 'Markdown' }
                );
            });
            
        } catch (error) {
            consoleDisplay.showError(error);
            bot.sendMessage(chatId, '❌ *Error occurred!*\n' + error.message, {
                parse_mode: 'Markdown'
            });
        }
    });

    bot.onText(/\/addprem (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const userName = msg.from.username || msg.from.first_name;
        
        consoleDisplay.logCommand(userId, userName, 'addprem', match[1]);
        
        if (userId != settings.ownerId) {
            bot.sendMessage(chatId, '❌ *Access Denied!*\nOnly owner can use this command.', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        const targetId = parseInt(match[1]);
        if (isNaN(targetId)) {
            bot.sendMessage(chatId, '❌ Invalid ID!');
            return;
        }
        
        try {
            bot.getChat(targetId).then(chat => {
                const success = database.addPremium(targetId, chat.username || '');
                
                if (success) {
                    consoleDisplay.logAdminAction(userId, 'ADD_PREMIUM', targetId);
                    
                    bot.sendMessage(targetId,
                        `🎉 *CONGRATULATIONS!*\n\n` +
                        `You have been upgraded to *PREMIUM USER* by admin!\n\n` +
                        `✅ Premium features unlocked\n` +
                        `✅ Unlimited Reports\n` +
                        `✅ Full support`,
                        { parse_mode: 'Markdown' }
                    ).catch(() => {});
                    
                    bot.sendMessage(chatId, `✅ Premium added for user ${targetId}`);
                } else {
                    bot.sendMessage(chatId, '⚠️ User is already premium!');
                }
            }).catch(() => {
                database.addPremium(targetId, '');
                consoleDisplay.logAdminAction(userId, 'ADD_PREMIUM', targetId);
                bot.sendMessage(chatId, `✅ Premium added for user ${targetId}`);
            });
        } catch (error) {
            consoleDisplay.showError(error);
            bot.sendMessage(chatId, '❌ Error: ' + error.message);
        }
    });

    bot.onText(/\/removeprem (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        if (userId != settings.ownerId) {
            bot.sendMessage(chatId, '❌ *Access Denied!*', { parse_mode: 'Markdown' });
            return;
        }
        
        const targetId = parseInt(match[1]);
        if (isNaN(targetId)) {
            bot.sendMessage(chatId, '❌ Invalid ID!');
            return;
        }
        
        const success = database.removePremium(targetId);
        if (success) {
            consoleDisplay.logAdminAction(userId, 'REMOVE_PREMIUM', targetId);
            bot.sendMessage(chatId, `✅ Premium removed for user ${targetId}`);
        } else {
            bot.sendMessage(chatId, '⚠️ User not found!');
        }
    });

    bot.onText(/\/listprem/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        consoleDisplay.logCommand(userId, msg.from.username || msg.from.first_name, 'listprem');
        
        if (userId != settings.ownerId) {
            bot.sendMessage(chatId, '❌ *Access Denied!*\nOnly owner can use this command.', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        const premiumUsers = database.getPremiumUsers();
        let message = `⭐ *PREMIUM USERS*\n\nTotal: ${premiumUsers.length}\n\n`;
        
        premiumUsers.forEach((user, index) => {
            message += `${index + 1}. ${user.username ? '@sneuo' + user.username : 'No username'}\n`;
            message += `   🆔: ${user.id}\n\n`;
        });
        
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });

    bot.onText(/\/listaccess/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        consoleDisplay.logCommand(userId, msg.from.username || msg.from.first_name, 'listaccess');
        
        if (userId != settings.ownerId) {
            bot.sendMessage(chatId, '❌ *Access Denied!*\nOnly owner can use this command.', {
                parse_mode: 'Markdown'
            });
            return;
        }
        
        const accessUsers = database.getAccessUsers();
        let message = `🎫 *ACCESS USERS*\n\nTotal: ${accessUsers.length}\n\n`;
        
        accessUsers.forEach((user, index) => {
            message += `${index + 1}. ${user.username ? '@sneuo' + user.username : 'No username'}\n`;
            message += `   🆔: ${user.id}\n`;
            message += `   🎫 Access: ${user.access}\n`;
            message += `   📊 Used: ${user.used || 0}\n\n`;
        });
        
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });
};
