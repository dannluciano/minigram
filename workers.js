const throng = require('throng')

throng({
  workers: process.env['workers'] || 1,
  master: startMaster,
  start: startWorker
})

function startMaster (id) {
  console.log(`Started Master ${id} Pid ${process.pid}`)
  init()

  process.on('SIGTERM', () => {
    console.log(`Master ${process.pid} exiting...`)
    process.exit()
  })
}

function startWorker (id) {
  console.log(`Started worker ${id} Pid ${process.pid}`)

  process.on('SIGTERM', () => {
    console.log(`Worker ${id} exiting...`)
    process.exit()
  })
}
