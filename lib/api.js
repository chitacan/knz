const got = require('got')
const {config} = require('./utils')

const client = got.extend({
})

const opts = (opt) => {
  return {
    ...opt,
    prefixUrl: `https://${config.get('subdomain')}.kanbanize.com/index.php/api/kanbanize`,
    headers: {
      accept: 'application/json',
      apikey: config.get('apikey')
    }
  }
}

exports.getCard = taskid => client.post('get_task_details', opts({json: {taskid}})).json()
