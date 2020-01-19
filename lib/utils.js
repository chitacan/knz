const {basename} = require('path')
const ex = require('execa')
const Conf = require('conf')

const TASK_REGEX = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;
const config = new Conf({
  projectName: 'knz',
  schema: {
    subdomain: {
      type: 'string'
    },
    apikey: {
      type: 'string'
    }
  }
})

const matchTask = str => str.split('').reverse().join('').match(TASK_REGEX) !== null

const getBranch = () => ex('git', ['rev-parse', '--abbrev-ref', 'HEAD']).then(({stdout}) => stdout)

exports.checks = () => {
  if (!config.has('subdomain') || !config.has('apikey')) {
    throw new Error("invalid configs. run 'knz init' first.")
  }
}

exports.resolveTaskId = async (taskid) => {
  if (!!taskid && typeof +taskid === 'number') {
    return taskid
  }

  const dir = basename(process.cwd())
  if (matchTask(dir)) {
    return dir.split('-')[1]
  }

  const branch = await getBranch()
    .then(d => basename(d))
    .catch(() => '')

  if (matchTask(branch)) {
    return branch.split('-')[1]
  }

  throw new Error('Cannot resolve taskid')
}

exports.cardURL = (taskid, boardid) => {
  return `https://${config.get('subdomain')}.kanbanize.com/ctrl_board/${boardid}/cards/${taskid}/details/`
}

exports.appendConfigPath = help => `${help}
Config path: ${config.path}
`

exports.config = config

exports.saveConfig = d => config.set(d)
