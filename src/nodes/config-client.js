module.exports = function (RED) {
  'use strict'

  const utils = require('../services/utils.js')
  const _ = require('lodash')

  const VictronClient = require('../services/victron-client.js')

  /**
     * VictronClient should be initialized as a global singleton.
     * This way, deploying the flows doesn't reset the connection
     * and cache.
     */
  let globalClient = null

  /**
     * An endpoint for nodes to request services from - returns either a single service, or
     * all available services depending whether the requester gives the service parameter
     */

  RED.httpNode.get('/victron/services/:service?', RED.auth.needsPermission('victron-client.read'), (req, res) => {
    if (!globalClient) return res.status(503).send('Client not initialized')
    const serialized = JSON.stringify(globalClient.system.listAvailableServices(req.params.service))
    res.setHeader('Content-Type', 'application/json')
    return res.send(serialized)
  })

  RED.httpNode.get('/victron/cache', RED.auth.needsPermission('victron-client.read'), (req, res) => {
    if (!globalClient) return res.status(503).send('Client not initialized')
    const serialized = JSON.stringify(globalClient.system.cache)
    res.setHeader('Content-Type', 'application/json')
    return res.send(serialized)
  })

  /**
     * Victron Energy Configuration Node.
     *
     * This global configuration node is used by
     * all the other Victron Energy nodes to access the dbus.
     *
     * It keeps track of incoming status messages and updates
     * listening nodes' status in the UI accordingly.
     */
  function ConfigVictronClient (config) {
    RED.nodes.createNode(this, config)

    if (!globalClient) {
      const enablePolling = config.enablePolling || false
      globalClient = new VictronClient(
        process.env.NODE_RED_DBUS_ADDRESS,
        { enablePolling }
      )
      globalClient.connect()
    }

    this.client = globalClient
    this.showValues = config.showValues
    this.enablePolling = config.enablePolling || false
    this.contextStore = config.contextStore
    let statusListeners = []

    /**
         * This node registers a VictronClient status update listener
         * that updates each node's statuses when a path gets added
         * or a service removed.
         *
         * Current architecture supports for service and path additions,
         * but only service-level disconnects (so, e.g. a disappearing
         * system relay doesn't get registered).
         */
    this.client.onStatusUpdate = (msg, status) => {
      statusListeners.forEach(obj => {
        if (obj.service && obj.service === msg.service) {
          if (status === utils.STATUS.SERVICE_REMOVE) { obj.node.status(utils.DISCONNECTED) } else if (status === utils.STATUS.PATH_ADD && obj.path === msg.path) {
            obj.node.status(utils.CONNECTED)
          } else if (status === utils.STATUS.SERVICE_MIGRATE) { obj.node.status(utils.MIGRATE) }
        }
      })
    }

    // isConnected function is called to check the node
    // connection state and adjust the node status accordingly
    this.addStatusListener = (listener, service, path) => {
      const id = utils.UUID()

      listener.status(utils.DISCONNECTED)
      // Upon initialization, the initial node status will be fetched from the cache
      if (service) {
        if (_.get(this.client, ['system', 'cache', service, path]) !== undefined) {
          listener.status(utils.CONNECTED)
        }
      }

      statusListeners.push({
        node: listener,
        service,
        path,
        id
      })

      return id
    }

    this.removeStatusListener = id => { statusListeners = statusListeners.filter(o => o.id === id) }
  }

  RED.nodes.registerType('victron-client', ConfigVictronClient)
}
