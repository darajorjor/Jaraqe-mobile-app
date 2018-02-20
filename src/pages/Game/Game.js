import React from 'react'
import {
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
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

const { width } = Dimensions.get('window')

@api((props) => ({
  url: `games/${props.game.id}/play`,
  method: 'POST',
  name: 'play',
}))
@api((props) => ({
  url: `games/${props.game.id}/surrender`,
  method: 'POST',
  name: 'surrender',
}))
@api((props) => ({
  url: `games/${props.game.id}`,
  method: 'GET',
  name: 'getGame',
  options: {
    instantCall: false,
  },
}))
@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { setProfileField },
)
@autobind
export default class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playedGame: null,
      shouldRender: false,
    }
  }

  componentDidMount() {
    const { data: { getGameRefetch } } = this.props

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
          }
        })
    }, 5000)
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  handlePlay() {
    const { data: { play } } = this.props
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
        alert(game.history[game.history.length - 1].words.map((word) => word.word).join(', '))
      })
      // .catch(e => console.error(e))
  }

  handleSurrender() {
    const { data: { surrender } } = this.props

    surrender()
      .then(() => alert('تو باختی!‌:))))))'))
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
          onChatPress={() => navigate({
            navigator: this.props.navigator,
            method: 'push',
            screen: 'Chat',
            options: {
              passProps: {},
              navigatorStyle: {
                tabBarHidden: true,
              },
            },
          })}
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