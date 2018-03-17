import { GiftedChat } from 'react-native-gifted-chat'
import events from 'src/redux/middlewares/socket/events'

const SEND = 'jaraqe/chat/SEND'
const SET_INITIAL_MESSAGES = 'jaraqe/chat/SET_INITIAL_MESSAGES'

const initialState = {
  loading: false,
  messages: [
    // {
    //   _id: 1,
    //   text: 'Hello developer',
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: 'React Native',
    //     avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //   },
    // },
  ],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEND:
      return {
        ...state,
        messages: GiftedChat.append(state.messages, action.data),
      }
    case SET_INITIAL_MESSAGES:
      return {
        ...state,
        messages: action.data,
      }
    case events.NEW_MESSAGE:
      try {
        if (action.data.sender.id === action.state.Main.profile.id) {
          return state
        }

        const message = action.data

        return {
          ...state,
          messages: GiftedChat.append(state.messages, {
            _id: message._id,
            createdAt: message.time,
            text: message.message,
            user: {
              _id: message.sender.id,
              name: message.sender.fullName || message.sender.username,
              avatar: message.sender.avatar,
            }
          }),
        }
      } catch (e) {
        console.error(e)
      }
      return
    default:
      return state
  }
}

export function setInitialMessages(messages) {
  return {
    type: SET_INITIAL_MESSAGES,
    data: messages.map(i => ({
      _id: i._id,
      createdAt: i.time,
      text: i.message,
      user: {
        _id: i.sender.id,
        name: i.sender.fullName || i.sender.username,
        avatar: i.sender.avatar,
      }
    })),
  }
}

export function send(data, gameId) {
  return (dispatch) => {
    data.forEach(message => {
      dispatch({
        type: events.CHAT,
        data: {
          message,
          gameId,
        },
        useSocket: true,
      })
    })

    return dispatch({
      type: SEND,
      data,
    })
  }
}

export function seeMessages(gameId) {
  return {
    type: events.SEE_MESSAGES,
    data: {
      gameId,
    },
    useSocket: true,
  }
}
