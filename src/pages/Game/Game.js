import React from 'react'
import {
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import PropTypes from 'prop-types'
import Board from './components/Board'
import GameBar from './components/GameBar'
import GameNav from './components/GameNav'
import MeaningModal from './components/MeaningModal'
import { autobind } from 'core-decorators'
import api from 'src/utils/ApiHOC'
import _ from 'lodash'
import { connect } from 'react-redux'
import GameOptions from './components/GameOptions/GameOptions'
import { setProfileField } from 'src/redux/Main.reducer'
import { navigate } from 'src/utils/helpers/navigation.helper'
import { setToStore } from 'src/utils/ApiHOC/redux'

const { width } = Dimensions.get('window')

@api((props) => ({
  url: `games/${props.game.id}`,
}), {
  method: 'GET',
  name: 'getGame',
})
@api((props) => ({
  url: `games/${props.game.id}/play`,
}), {
  method: 'POST',
  name: 'play',
})
@api((props) => ({
  url: `games/${props.game.id}/surrender`,
}), {
  method: 'POST',
  name: 'surrender',
})
@connect(
  state => ({
    profile: state.Main.profile,
  }),
  {
    setProfileField,
    setToStore,
  },
)
@autobind
export default class Game extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      playedGame: null,
      shouldRender: false,
    }
  }

  componentDidMount() {
    const { data: { getGameRefetch }, setToStore } = this.props

    this.timeout = setTimeout(() => {
      this.setState({
        shouldRender: true,
      })
    }, 200)

    this.interval = setInterval(() => {
      getGameRefetch()
        .then(game => {
          if (!_.isEqual(game, this.state.game)) {
            this.setState({ playedGame: game })
            setToStore('games', this.getStoreGames().map(g => {
              if (g.id === game.id) {
                g = game
              }

              return g
            }))
          }
        })
    }, 100000)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  getStoreGames() {
    const { store } = this.context
    const { ApiHOC: { root: { games } } } = store.getState()

    return games
  }

  handlePlay() {
    const { data: { play }, setToStore } = this.props
    const data = this.board.gatherInfo()

    if (data.length < 1) {
      return null
    }

    play({
      body: {
        letters: data.map(d => ({
          id: d.letter.id,
          coordinates: {
            row: +d.row,
            col: +d.col
          }
        }))
      }
    })
      .then(({ game }) => {
        this.setState({
          playedGame: game,
        })
        // update game in game list
        setToStore('games', this.getStoreGames().map(g => {
          if (g.id === game.id) {
            g = game
          }

          return g
        }))
        // alert(game.history[game.history.length - 1].words.map((word) => word.word).join(', '))
      })
      .catch(e => toast({ title: 'خطایی رخ داد', status: 'error' }))
    // .catch(e => console.error(e))
  }

  handleSurrender() {
    const { navigator, data: { surrender }, setToStore, game } = this.props

    setToStore('games', this.getStoreGames().filter(g => g.id !== game.id))

    return surrender()
      .then(() => {
        navigate({
          navigator,
          method: 'pop',
        })
      })
    // .catch(e => console.error(e))
  }

  render() {
    let { game, profile } = this.props
    const { playedGame } = this.state

    if (playedGame) {
      game = playedGame
    }

    return (
      <View style={{ flex: 1, paddingTop: 70, backgroundColor: '#fff' }}>
        {
          this.state.shouldRender ?
            <Board
              ref={ref => this.board = ref}
              game={game}
              powerUps={profile.powerUps}
              setProfileField={this.props.setProfileField}
              onWordSearch={({ from, words }) => {
                this.refs.meaningModal.getWrappedInstance().getWrappedInstance().grow(from, words)
              }}
            />
            :
            <View
              style={{
                flex: 1,
                width,
                height: width,
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator />
            </View>
        }
        <GameNav
          navigator={this.props.navigator}
          player={game.players[0]}
          player2={game.players[1]}
          onChatPress={() => {
            navigate({
              navigator: this.props.navigator,
              method: 'push',
              screen: 'Chat',
              options: {
                passProps: {
                  gameId: game.id,
                  initialMessages: game.messages,
                },
                navigatorStyle: {
                  tabBarHidden: true,
                },
              },
            })
          }}
        />
        <GameBar
          submitDisabled={!game.players.find(p => !!p.rack).shouldPlayNext}
          onSubmit={this.handlePlay}
          onOptions={() => this.refs.gameOptions.open()}
        />
        <MeaningModal
          ref="meaningModal"
        />
        <GameOptions
          ref="gameOptions"
          onSurrender={this.handleSurrender}
          onSwap={() => this.board.openSwapModal()}
        />
      </View>
    )
  }
}