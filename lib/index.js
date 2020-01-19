const cmd = require('commander')
const inc = require('inquirer')
const {red} = require('chalk')
const open = require('open')
const {getCard} = require('./api')
const {checks, config, resolveTaskId, appendConfigPath, saveConfig, cardURL} = require('./utils')
const printCard = require('./card')
const {version, description} = require('../package')

cmd.version(version)
  .description(description)

cmd.command('init')
  .description('initialize knz')
  .action(() => {
    inc.prompt([{
      name: 'subdomain',
      message: 'your kanbanize subdomain',
      validate: d => d.length > 0
    }, {
      name: 'apikey',
      type: 'password',
      message: 'your kanbanize API key',
      validate: d => d.length > 0
    }, {
      name: 'prefix',
      message: 'your project prefix on branch (ex. feature/<PREFIX>-123)',
      validate: d => d.length > 0
    }])
    .then(res => saveConfig(res))
  })

cmd.command('show [id]')
  .alias('s')
  .option('-r --raw', 'print raw output')
  .option('-d --show-description', 'print description')
  .description('show kanbanize task')
  .action(async (id, {raw, showDescription}) => {
    try {
      checks()
      const taskid = await resolveTaskId(id)
      const card = await getCard(taskid)

      if (raw) {
        console.log(card)
      } else {
        printCard(card, {showDescription})
      }
    } catch (e) {
      console.error(red(e.message))
    }
  })

cmd.command('open [id]')
  .alias('o')
  .description('open kanbanize task in your browser')
  .action(async (id) => {
    try {
      checks()
      const taskid = await resolveTaskId(id)
      const card = await getCard(taskid)
      await open(cardURL(card.taskid, card.boardid))
    } catch (e) {
      console.error(red(e.message))
    }
  })

cmd.command('config')
  .description('show config')
  .action(() => console.log(config.store))

cmd.command('clear')
  .description('clear config')
  .action(() => config.clear())

cmd.on('command:*', function () {
  cmd.help(appendConfigPath)
  process.exit(1)
});

if (!process.argv.slice(2).length) {
  cmd.outputHelp(appendConfigPath)
}

cmd.parse(process.argv)
