import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { autobind } from 'core-decorators'
import PinchZoomView from '../ZoomView/ZoomView'
import LetterBar from "../LetterBar/LetterBar"
import Tile from "../Tile/Tile"
import Jext from 'src/common/Jext'

const { width, height } = Dimensions.get('window')

@autobind
export default class Board extends React.Component {
  constructor() {
    super()

    this.state = {
      tileCoordinates: []
    }
  }

  renderTiles() {
    const { game } = this.props
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('Board.renderTiles')
    const tileMap = JSON.parse(JSON.stringify(game.board.pattern)) // allaho samad
    const margin = 2

    const tileCoordinates = [...tileMap]
    let tileCoordinatesCount = 0

    return tileMap.map((row, rowIndex) => (
      <View
        key={`row-${rowIndex}`}
        ref={`row-${rowIndex}`}
        style={{ flexDirection: 'row', }}
      >
        {
          row.map((column, columnIndex) => (
            <Tile
              key={`row-${rowIndex}-column-${columnIndex}`}
              ref={`row-${rowIndex}-column-${columnIndex}`}
              style={{
                margin,
              }}
              placeHolder={column}
              letter={column && column.value}
              onGrab={this.refs.letterBar && this.refs.letterBar.retakeLetter}
              onRender={(ref) => {
                ref.measure((x, y, width, height, pageX, pageY) => {
                  tileCoordinatesCount++
                  tileCoordinates[rowIndex][columnIndex] = {
                    ref: `row-${rowIndex}-column-${columnIndex}`,
                    rectangle: {
                      x2: pageX + width,
                      x1: pageX,
                      y2: pageY + width,
                      y1: pageY
                    },
                    width,
                    height,
                    pageX,
                    pageY,
                    letter: column
                  }

                  let total = 0
                  tileMap.map(row => {
                    row.map(col => total++)
                  })
                  if (tileCoordinatesCount === total) {
                    this.setState({ tileCoordinates })
                  }
                })
              }}
            />
          ))
        }
      </View>
    ))
  }

  checkTileMatching(nativeEvent, gesture) {
    console.log('Board.checkTileMatching')
    const { tileCoordinates } = this.state
    const { zoomView } = this.refs

    let {
      scale,
      offsetX,
      offsetY,
    } = zoomView.getOffsets()

    const point = {
      x: (gesture.moveX - (offsetX * scale)),
      y: (gesture.moveY - (offsetY * scale))
    }

    if (nativeEvent.pageY > (height - 100)) {
      return null
    }

    let minDistance = 100
    let closestTile = null

    tileCoordinates.forEach((row, rowIndex) => {
      row.forEach(({ rectangle, ...rest }, colIndex) => {
        const xOffsetFromCenter = (((rest.width) + 4) * (-8 + (colIndex + 1)))
        const yOffsetFromCenter = (((rest.height) + 4) * (-8 + (rowIndex + 1)))

        const x1 = (rectangle.x1 + (scale !== 1 ? xOffsetFromCenter : 0))
        const y1 = (rectangle.y1 + (scale !== 1 ? yOffsetFromCenter : 0))
        const x2 = x1 + ((rest.width * scale) + 4)
        const y2 = y1 + ((rest.height * scale) + 4)

        const rectangleCenter = {
          x: x2 - ((x2 - x1) / 2),
          y: y2 - ((y2 - y1) / 2),
        }

        const distance = Math.hypot(rectangleCenter.x - point.x, rectangleCenter.y - point.y)

        if (distance < minDistance) {
          minDistance = distance
          closestTile = {
            x: x1,
            y: y1,
            xOffsetFromCenter,
            yOffsetFromCenter,
            ...rest
          }
        }
      })
    })

    if (closestTile) {
      const { [closestTile.ref]: tileRef } = this.refs

      if (closestTile.letter && closestTile.letter.value) {
        return null
      }

      return {
        ...closestTile,
        handle: tileRef,
        isActive: tileRef.isActive(),
        zoom: () => {
          zoomView.zoom({
            offsetX: -closestTile.xOffsetFromCenter,
            offsetY: -closestTile.yOffsetFromCenter,
          })
        }
      }
    }

    return null
  }

  gatherInfo() {
    const { tileCoordinates } = this.state

    const tileRefs = Object.keys(this.refs).filter(ref => ref.includes('row')).filter(ref => ref.includes('column'))

    const activeTiles = []
    tileRefs.map(ref => {
      const tile = this.refs[ref]

      if (tile.isActive()) {
        const [r, row, c, col] = ref.split('-')

        activeTiles.push({
          letter: tile.isActive(),
          row,
          col,
        })
      }
    })

    return activeTiles
  }

  render() {
    const { game } = this.props
    const { tileCoordinates } = this.state

    return (
      <View style={[styles.wrapper]}>
        {
          tileCoordinates.length === 0 &&
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              zIndex: 99999,
            }}
          >
            <Jext>Rendering the board...</Jext>
          </View>
        }
        <PinchZoomView
          onViewChange={viewInfo => null}
          checkGrabZone={this.checkTileMatching}
          onDrag={this.refs.letterBar ? this.refs.letterBar.onDrag : null}
          onDrop={this.refs.letterBar ? this.refs.letterBar.onDrop : null}
          setDragStart={this.refs.letterBar ? (xy) => {
            this.refs.letterBar.setDragStart(xy)
          } : null}
          ref='zoomView'>
          {this.renderTiles()}
        </PinchZoomView>
        <LetterBar
          ref="letterBar"
          checkDropZone={this.checkTileMatching}
          initialLetters={game.players.find(p => !!p.rack).rack}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width,
    height: width,
    overflow: 'hidden'
  }
})
