const moment = require('moment');
const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

class ConsoleDisplay {
    constructor() {
        this.startTime = new Date();
        this.commandsUsed = 0;
        this.reportsMade = 0;
        this.ensureLogFile();
    }

    ensureLogFile() {
        if (!fs.existsSync('./bot_console.log')) {
            fs.writeFileSync('./bot_console.log', '=== Telegram Bot Console Log ===\n');
        }
    }

    showBanner() {
        console.clear();
        console.log(`\n${colors.cyan}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ██████╗ ██╗   ██╗███████╗███╗   ██╗██╗   ██╗${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ██╔══██╗╚██╗ ██╔╝██╔════╝████╗  ██║╚██╗ ██╔╝${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ██████╔╝ ╚████╔╝ █████╗  ██╔██╗ ██║ ╚████╔╝ ${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ██╔═══╝   ╚██╔╝  ██╔══╝  ██║╚██╗██║  ╚██╔╝  ${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ██║        ██║   ███████╗██║ ╚████║   ██║   ${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.yellow}  ╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝   ${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}╠══════════════════════════════════════════════════════════╣${colors.reset}`);
        console.log(`${colors.cyan}║${colors.magenta}  ✦ BOT MONITORING SYSTEM v2.0                         ${colors.cyan}║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.gray}  ⚡ Status: ${colors.green}● ONLINE${colors.gray}  |  🔒 Secure: ${colors.green}Active${colors.gray}  |  🚀 Ready${colors.cyan}  ║${colors.reset}`);
        console.log(`${colors.cyan}╠══════════════════════════════════════════════════════════╣${colors.reset}`);
        console.log(`${colors.cyan}║${colors.blue}  📱 Developer : ${colors.white}@sneuo${colors.cyan}                                  ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.blue}  🤖 Bot      : ${colors.white}@veyora888${colors.cyan}                               ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.blue}  💻 Version  : ${colors.white}2.0.0${colors.cyan}                                      ║${colors.reset}`);
        console.log(`${colors.cyan}║${colors.blue}  ⚙️  Engine   : ${colors.white}Node.js ${process.version}${colors.cyan}                    ║${colors.reset}`);
        console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════╝${colors.reset}\n`);
    }

    showStatus(botUsername, premiumCount, accessCount) {
        const uptime = this.getUptime();
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        
        console.log(`${colors.green}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.green}║${colors.yellow}  📊 SYSTEM STATUS                                    ${colors.green}║${colors.reset}`);
        console.log(`${colors.green}╠══════════════════════════════════════════════════════════╣${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  🤖 Bot        : ${colors.white}@${botUsername}${colors.green}                             ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  ⏰ Started    : ${colors.white}${moment(this.startTime).format('YYYY-MM-DD HH:mm:ss')}${colors.green}      ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  ⏱️  Uptime     : ${colors.white}${uptime}${colors.green}                              ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  💾 Memory     : ${colors.white}${memoryUsage} MB${colors.green}                              ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  👑 Premium    : ${colors.white}${premiumCount} users${colors.green}                           ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  🎫 Access     : ${colors.white}${accessCount} users${colors.green}                           ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  📊 Commands   : ${colors.white}${this.commandsUsed} executed${colors.green}                    ║${colors.reset}`);
        console.log(`${colors.green}║${colors.cyan}  📈 Reports    : ${colors.white}${this.reportsMade} sent${colors.green}                         ║${colors.reset}`);
        console.log(`${colors.green}╚══════════════════════════════════════════════════════════╝${colors.reset}\n`);

        console.log(`${colors.blue}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.blue}║${colors.yellow}  📋 COMMAND LIST                                    ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}╠══════════════════════════════════════════════════════════╣${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /start      - Main menu with photo                   ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /menu       - Show all available commands            ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /reportacc  - Report Telegram account                ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /reportch   - Report Telegram channel                ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /myprem     - Check premium/access status            ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.gray}  ─────────────────────────────────────────────────    ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.red}  🔒 OWNER COMMANDS                                    ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /access     - Add access to user                     ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /addprem    - Add premium user                       ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /removeprem - Remove premium user                    ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /listprem   - List all premium users                 ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /listaccess - List all access users                  ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}║${colors.white}  /help       - Show help menu                         ${colors.blue}║${colors.reset}`);
        console.log(`${colors.blue}╚══════════════════════════════════════════════════════════╝${colors.reset}\n`);

        console.log(`${colors.green}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.green}║${colors.green}  🚀 BOT IS RUNNING & READY FOR COMMANDS...              ${colors.green}║${colors.reset}`);
        console.log(`${colors.green}╚══════════════════════════════════════════════════════════╝${colors.reset}\n`);
    }

    logCommand(userId, username, command, args = '') {
        this.commandsUsed++;
        const timestamp = moment().format('HH:mm:ss');
        const logLine = `${colors.gray}[${timestamp}]${colors.reset} ${colors.green}⚡ CMD${colors.reset} ${colors.white}/${command}${colors.reset} ${colors.yellow}${args}${colors.reset} ${colors.dim}→${colors.reset} ${colors.cyan}@${username}${colors.reset} ${colors.dim}(${userId})${colors.reset}`;
        console.log(logLine);
        
        const fileLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] CMD: /${command} ${args} | User: @${username} (${userId})`;
        fs.appendFileSync('./bot_console.log', fileLog + '\n');
    }

    logReport(userId, target, type, count, success) {
        this.reportsMade++;
        const timestamp = moment().format('HH:mm:ss');
        const status = success ? `${colors.green}✅` : `${colors.red}❌`;
        const logLine = `${colors.gray}[${timestamp}]${colors.reset} ${colors.yellow}📨 REPORT${colors.reset} ${colors.white}${type}${colors.reset} ${colors.dim}→${colors.reset} ${colors.cyan}${target}${colors.reset} ${colors.dim}|${colors.reset} ${colors.magenta}Count: ${count}${colors.reset} ${status}`;
        console.log(logLine);
        
        const fileLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] REPORT: ${type} | Target: ${target} | Count: ${count} | User: ${userId}`;
        fs.appendFileSync('./bot_console.log', fileLog + '\n');
    }

    logAdminAction(userId, action, targetId) {
        const timestamp = moment().format('HH:mm:ss');
        const logLine = `${colors.gray}[${timestamp}]${colors.reset} ${colors.magenta}👑 ADMIN${colors.reset} ${colors.white}${action}${colors.reset} ${colors.dim}→${colors.reset} ${colors.cyan}${targetId}${colors.reset} ${colors.dim}|${colors.reset} ${colors.green}By: ${userId}${colors.reset}`;
        console.log(logLine);
        
        const fileLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ADMIN: ${action} | Target: ${targetId} | By: ${userId}`;
        fs.appendFileSync('./bot_console.log', fileLog + '\n');
    }

    logAccess(userId, access, action) {
        const timestamp = moment().format('HH:mm:ss');
        const logLine = `${colors.gray}[${timestamp}]${colors.reset} ${colors.blue}🎫 ACCESS${colors.reset} ${colors.white}${action}${colors.reset} ${colors.dim}→${colors.reset} ${colors.cyan}${userId}${colors.reset} ${colors.dim}|${colors.reset} ${colors.green}Remaining: ${access}${colors.reset}`;
        console.log(logLine);
        
        const fileLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ACCESS: ${action} | User: ${userId} | Access: ${access}`;
        fs.appendFileSync('./bot_console.log', fileLog + '\n');
    }

    getUptime() {
        const now = new Date();
        const diff = now - this.startTime;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }

    showError(error) {
        const timestamp = moment().format('HH:mm:ss');
        console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors.red}⚠️ ERROR${colors.reset} ${colors.white}${error.message}${colors.reset}`);
        
        const fileLog = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR: ${error.message}`;
        fs.appendFileSync('./bot_console.log', fileLog + '\n');
    }

    showShutdown() {
        console.log(`\n${colors.yellow}╔══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.yellow}║${colors.red}  ⏹️  BOT SHUTDOWN                                    ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}╠══════════════════════════════════════════════════════════╣${colors.reset}`);
        console.log(`${colors.yellow}║${colors.white}  📊 Total Commands : ${this.commandsUsed}                            ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}║${colors.white}  📈 Total Reports  : ${this.reportsMade}                            ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}║${colors.white}  ⏱️  Total Uptime   : ${this.getUptime()}                            ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}║${colors.blue}  📱 Developer      : @sneuo                            ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}║${colors.green}  👋 Goodbye!                                         ${colors.yellow}║${colors.reset}`);
        console.log(`${colors.yellow}╚══════════════════════════════════════════════════════════╝${colors.reset}\n`);
    }
}

module.exports = new ConsoleDisplay();