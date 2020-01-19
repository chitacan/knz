const c = require('chalk')
const {format} = require('timeago.js')
const {EOL} = require('os')
const {cardURL} = require('./utils')

const formatPriority = priority => {
  switch (priority) {
    case 'Average':
      return c.green('*')
    case 'Low':
      return c.blue('▼')
    case 'High':
      return c.yello('▲')
    case 'Critical':
      return c.red('▲')
  }
}

const formatDescription = description => {
  const format = description
    .split('\n')
    .map(d => '  ' + d)
    .join(EOL)
  return c.gray(format)
}

const formatSubtask = (subtasks, subtaskscomplete) => {
  const tasks = +subtasks
  const completed = +subtaskscomplete

  if (tasks === 0) {
    return ''
  } else if (tasks === completed) {
    return ` ${c.green(tasks)}${c.gray('/')}${c.green(tasks)}`
  }

  return ` ${c.gray(completed)}${c.gray('/')}${tasks}`
}

const formatAssignee = (assignee, reporter) => {
  if (assignee !== reporter) {
    return `${c.gray(reporter)} ${assignee}`
  }

  return `${assignee} ${c.gray('(=)')}`
}

const formatURL = (taskid, boardid) => c.gray(cardURL(taskid, boardid))

module.exports = ({
  taskid, boardid, title, description, assignee, columnname, reporter, updatedat, subtasks, subtaskscomplete, color, priority
}, {showDescription})=> {
  let result = `
  ${c.bgHex(color)('   ')} ${formatPriority(priority)} ${taskid} ${c.underline.cyan(columnname)}${formatSubtask(subtasks, subtaskscomplete)} ${formatAssignee(assignee, reporter)} ${format(Date.parse(updatedat))}

  ${c.gray(title)}
`
  if (showDescription) {
    result += `
  ${formatDescription(description)}
`
  }

  result += `
  ${formatURL(taskid, boardid)}
`

  console.log(result)
}
