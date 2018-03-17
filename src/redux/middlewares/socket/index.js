/* eslint-disable no-unused-vars */
import * as actions from './redux'
import events from './events'

const socketMiddleware = (() => {
  let socket = null

  const onOpen = (ws, store) => evt => {
    // Send a handshake, or authenticate with remote end

    // Tell the store we're connected
    store.dispatch(actions.connected())
  }

  const onClose = (ws, store, token) => evt => {
    // Tell the store we've disconnected
    store.dispatch(actions.disconnected())
    setTimeout(() => {
      store.dispatch({
        type: 'socket/CONNECT',
        url: 'ws://localhost:3000/',
        token,
      })
    }, 1000)
  }

  const onMessage = (ws, store, session) => evt => {
    // Parse the JSON message received on the websocket
    console.log('Received a message: ', evt.data)
    const msg = JSON.parse(evt.data)

    switch (msg.type) {
      case events.WHO_IS_THIS:
        return ws.send(JSON.stringify({
          type: events.ITS_ME,
          session,
        }))
      default:
        store.dispatch({
          type: msg.type,
          data: msg.data,
          state: store.getState(),
        })
    }
  }

  return store => next => action => {
    if (action.useSocket) {
      socket.send(JSON.stringify({
        type: action.type,
        data: action.data,
      }))
    }

    switch (action.type) {
      // The user wants us to connect
      case 'socket/CONNECT':
        // Start a new connection to the server
        if (socket !== null) {
          socket.close()
        }
        // Send an action that shows a "connecting..." status for now
        store.dispatch(actions.connecting())

        socket = new WebSocket(action.url)
        socket.onmessage = onMessage(socket, store, action.token)
        socket.onclose = onClose(socket, store, action.token)
        socket.onopen = onOpen(socket, store)
        socket.onerror = (e) => {
          // an error occurred
          debugger
          store.dispatch(actions.error(e.message))
          console.error(e.message);
        };
        break
      // The user wants us to disconnect
      case 'socket/DISCONNECT':
        if (socket !== null) {
          socket.close()
        }
        socket = null

        // Set our state to disconnected
        store.dispatch(actions.disconnected())
        break
      // This action is irrelevant to us, pass it on to the next middleware
      default:
        return next(action)
    }

    return next(action)
  }
})()

export default socketMiddleware
