import React from 'react'
import {
  View,
  Dimensions,
} from 'react-native'
import Board from './components/Board'
import GameBar from './components/GameBar'
import GameNav from './components/GameNav'
import MeaningModal from './components/MeaningModal'
import { autobind } from 'core-decorators'
import api from 'src/utils/apiHOC'
import _ from 'lodash'

const { width } = Dimensions.get('window')

@api((props) => ({
  url: `games/${props.game.id}/play`,
  method: 'POST',
  name: 'play',
}))
@api((props) => ({
  url: `games/${props.game.id}`,
  method: 'GET',
  name: 'getGame',
  options: {
    instantCall: false,
  },
}))
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
    }, 0)

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

  handleSubmit() {
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
      .catch(e => console.error(e))
  }

  render() {
    let { game } = this.props
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
            onWordSearch={({ from, words }) => {
              this.refs.modal.getWrappedInstance().grow(from, words)
            }}
          />
            :
            <View
              style={{
                flex: 1,
                width,
                height: width,
                overflow: 'hidden'
              }}
            />
        }
        <GameNav
          navigator={this.props.navigator}
          player={game.players[0]}
          player2={game.players[1]}
        />
        <GameBar
          submitDisabled={!game.players.find(p => !!p.rack).shouldPlayNext}
          onSubmit={this.handleSubmit}
        />
        <MeaningModal
          ref="modal"
        />
      </View>
    )
  }
}