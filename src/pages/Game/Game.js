import React from 'react'
import {
  View,
} from 'react-native'
import Board from './components/Board'
import GameBar from './components/GameBar'
import GameNav from './components/GameNav'
import { autobind } from 'core-decorators'
import api from 'src/utils/apiHOC'

@api((props) => ({
  url: `games/${props.game.id}/play`,
  method: 'POST',
  name: 'play',
}))
@autobind
export default class Game extends React.Component {
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
      .then(({ game: { history } }) => {
        alert(history[history.length - 1].words.map((word) => word.word).join(', '))
      })
      .catch(e => console.error(e))
  }

  render() {
    const { game } = this.props

    return (
      <View style={{ flex: 1 }}>
        <GameNav
          player={game.players[0]}
          player2={game.players[1]}
        />
        <Board
          ref={ref => this.board = ref}
          game={game}
        />
        <GameBar
          submitDisabled={!game.players.find(p => !!p.rack).shouldPlayNext}
          onSubmit={this.handleSubmit}
        />
      </View>
    )
  }
}