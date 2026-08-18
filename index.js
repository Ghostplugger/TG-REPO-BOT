const TelegramBot = require('node-telegram-bot-api');
const settings = require('./config.js');
const consoleDisplay = require('./console.display.js');
const database = require('./lib/database.js');

const bot = new TelegramBot(settings.token, { 
  polling: true,
  request: {
    timeout: 60000
  }
});

consoleDisplay.showBanner();

const userStates = {};

const helpers = {
    checkUserAccess: (userId, chatId) => {
        if (userId == settings.ownerId || database.isPremium(userId)) {
            return true;
        }
        
        if (database.hasAccess(userId)) {
            return true;
        }
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: '❌ *Access Denied!*\n\n' +
            'Only premium/access users can use report features.\n\n' +
            `Use /myprem to check status\n` +
            `Contact @${settings.dev} for premium/access info`,
            parse_mode: 'Markdown'
        });
        return false;
    },
    
    getUserStatus: (userId) => {
        if (userId == settings.ownerId) return '👑 Owner';
        if (database.isPremium(userId)) return '⭐ Premium';
        if (database.hasAccess(userId)) return `🎫 Access (${database.getUserAccess(userId)})`;
        return '🔒 Regular';
    },
    
    showAllCommands: (chatId) => {
        const menuMessage = `<blockquote>📋 ALL COMMANDS</blockquote>
🕷 General Commands:
<blockquote>/myprem - Check your status</blockquote>
🕷 Report Commands:
<blockquote>/reportacc - Report Telegram account
/reportch - Report Telegram channel
Note: Only premium/access users can use</blockquote>
🕷 Owner Commands:
<blockquote>/access id nominal - Add access
/addprem id - Add premium user
/removeprem id - Remove premium
/listprem - List premium users
/listaccess - List access users</blockquote>`;
        
        bot.sendPhoto(chatId, settings.panel, {
            caption: menuMessage,
            parse_mode: 'HTML'
        });
    },
    
    startReportProcess: async (chatId, userId, type, target, reason, count, accessMessage) => {
        if (accessMessage && !accessMessage.includes('exhausted')) {
            bot.sendMessage(chatId, `📢 ${accessMessage}`);
        }
        
        const initialMessage = await bot.sendPhoto(chatId, settings.panel, {
            caption: getReportStartMessage(type, target, reason, count, 0),
            parse_mode: 'HTML'
        });
        
        simulateReportWithProgress(chatId, userId, type, target, reason, count, initialMessage.message_id);
    }
};

const getStartMessage = (userId, userName) => {
    return `<blockquote>👋 Hello @${userName}</blockquote>
「🤖 Telegram Auto Report Bot」
<blockquote>𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙩𝙞𝙤𝙣:
ケ Bot Name : GyzenLyoraa
ケ Developer : @sneuo
ケ Version : 1.0.0
ケ User ID : ${userId}
ケ Username : @${userName}</blockquote>
<blockquote>📌 Available Features:
• Account profile reporting
• Channel private image reporting
• Dual report system</blockquote>`;
};

const getMenuMessage = (userId, userName, status) => {
    return `<blockquote>📋 ALL COMMANDS</blockquote>
🕷 General Commands:
<blockquote>/myprem - Check your status</blockquote>
🕷 Report Commands:
<blockquote>/reportacc - Report Telegram account
/reportch - Report Telegram channel
Note: Only premium/access users can use</blockquote>
🕷 Owner Commands:
<blockquote>/access id nominal - Add access
/addprem id - Add premium user
/removeprem id - Remove premium
/listprem - List premium users
/listaccess - List access users</blockquote>`;
};

const getProgressBar = (percentage) => {
    const filled = '▰';
    const empty = '▱';
    const total = 10;
    const filledCount = Math.floor(percentage / 10);
    const emptyCount = total - filledCount;
    return filled.repeat(filledCount) + empty.repeat(emptyCount);
};

const getReportStartMessage = (type, target, reason, count, percentage) => {
    const progressBar = getProgressBar(percentage);
    const moduleName = `REPORT ${type.toUpperCase()}`;
    
    return `<blockquote>⌜🜲 𝙍𝙚𝙥𝙤𝙧𝙩 𝙎𝙮𝙨𝙩𝙚𝙢⌟
<i>Elite Report System</i>

⚘ <b>${moduleName}</b>

📌 Target: ${target}
📝 Reason: ${reason}
🔢 Count: ${count} reports

${progressBar} ${percentage}%

<code>INITIALIZING REPORT SEQUENCE</code></blockquote>`;
};

const getReportProgressMessage = (type, target, reason, count, percentage, success, failed, estimatedTime) => {
    const progressBar = getProgressBar(percentage);
    const moduleName = `REPORT ${type.toUpperCase()}`;
    const current = success + failed;
    
    let statusText = '';
    if (percentage < 30) {
        statusText = 'SCANNING TARGET';
    } else if (percentage < 60) {
        statusText = 'PREPARING REPORTS';
    } else if (percentage < 90) {
        statusText = 'SENDING REPORTS';
    } else {
        statusText = 'FINALIZING';
    }
    
    return `<blockquote>⌜🜲 𝙍𝙚𝙥𝙤𝙧𝙩 𝙎𝙮𝙨𝙩𝙚𝙢⌟
<i>Elite Report System</i>

⚘ <b>${moduleName}</b>

📌 Target: ${target}
✅ Success: ${success}
❌ Failed: ${failed}
📊 Progress: ${current}/${count}
⏱️ Estimated: ${estimatedTime} mins

${progressBar} ${percentage}%

<code>${statusText} • ${current}/${count} COMPLETE</code></blockquote>`;
};

const getReportCompleteMessage = (type, target, reason, count, success, failed) => {
    const moduleName = `REPORT ${type.toUpperCase()}`;
    const percentage = 100;
    const progressBar = getProgressBar(percentage);
    
    return `<blockquote>⌜🜲 𝙍𝙚𝙥𝙤𝙧𝙩 𝙎𝙮𝙨𝙩𝙚𝙢⌟
<i>Elite Report System</i>

⚘ <b>${moduleName}</b>

🎯 Target: ${target}
✅ Success: ${success}
❌ Failed: ${failed}
📊 Total: ${count} reports
⏱️ Finished: ${new Date().toLocaleTimeString()}

${progressBar} ${percentage}%

<code>REPORT COMPLETED • SECURE • STABLE • ELITE</code></blockquote>`;
};

async function simulateReportWithProgress(chatId, userId, type, target, reason, count, messageId) {
    let success = 0;
    let failed = 0;
    const totalCount = count;
    
    const updateInterval = 3000 + Math.random() * 2000;
    let lastUpdateTime = 0;
    
    const reportInterval = setInterval(async () => {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime < updateInterval) {
            return;
        }
        lastUpdateTime = currentTime;
        
        const current = success + failed;
        
        if (current >= totalCount) {
            clearInterval(reportInterval);
            
            try {
                await bot.editMessageCaption(
                    getReportCompleteMessage(type, target, reason, totalCount, success, failed),
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'HTML'
                    }
                );
            } catch (error) {
                console.log('Error editing final message:', error.message);
            }
            
            consoleDisplay.logReport(userId, target, type, totalCount, success > 0);
            return;
        }
        
        if (Math.random() < 0.85) {
            success++;
        } else {
            failed++;
        }
        
        const newCurrent = success + failed;
        const percentage = Math.min(99, Math.floor((newCurrent / totalCount) * 100));
        
        const remaining = totalCount - newCurrent;
        const estimatedTime = Math.max(1, Math.round((remaining * updateInterval / 1000 / 60)));
        
        if (newCurrent % 5 === 0 || percentage % 10 === 0 || newCurrent === totalCount) {
            try {
                await bot.editMessageCaption(
                    getReportProgressMessage(type, target, reason, totalCount, percentage, success, failed, estimatedTime),
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'HTML'
                    }
                );
            } catch (error) {
                console.log('Error editing progress message:', error.message);
            }
        }
    }, 1000);
}

require('./commands/main.js')(bot, database, settings, consoleDisplay, userStates, helpers, getStartMessage, getMenuMessage);
require('./commands/report.js')(bot, database, settings, consoleDisplay, userStates, helpers);
require('./commands/admin.js')(bot, database, settings, consoleDisplay, helpers);

bot.getMe().then(botInfo => {
    const premiumCount = database.getPremiumUsers().length;
    const accessCount = database.getAccessUsers().length;
    
    consoleDisplay.showStatus(botInfo.username, premiumCount, accessCount);
}).catch(error => {
    consoleDisplay.showError(error);
});

bot.on('polling_error', (error) => {
    consoleDisplay.showError(error);
});

process.on('SIGINT', () => {
    consoleDisplay.showShutdown();
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    consoleDisplay.showShutdown();
    bot.stopPolling();
    process.exit(0);
});