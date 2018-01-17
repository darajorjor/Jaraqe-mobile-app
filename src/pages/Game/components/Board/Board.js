import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { autobind } from 'core-decorators';
import PinchZoomView from '../ZoomView/ZoomView';
import LetterBar from "../LetterBar/LetterBar";
import { pointRectangleIntersection } from "src/helpers/math.helper";
import Tile from "../Tile/Tile";

const { width, height } = Dimensions.get('window');

@autobind
export default class Board extends React.Component {
  constructor() {
    super();

    this.state = {
      tileCoordinates: []
    };
  }

  renderTiles() {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('Board.renderTiles')
    const tileMap = [
      [null, null, null, 'TW', null, null, 'TL', null, 'TL', null, null, 'TW', null, null, null,],
      [null, null, 'DL', null, null, 'DW', null, null, null, 'DW', null, null, 'DL', null, null,],
      [null, 'DL', null, null, 'DL', null, null, null, null, null, 'DL', null, null, 'DL', null,],
      ['TW', null, null, 'TL', null, null, null, 'DW', null, null, null, 'TL', null, null, 'TW',],
      [null, null, 'DL', null, null, null, 'DL', null, 'DL', null, null, null, 'DL', null, null,],
      [null, 'DW', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'DW', null,],
      ['TL', null, null, null, 'DL', null, null, null, null, null, 'DL', null, null, null, 'TL',],
      [null, null, null, 'DW', null, null, null, '+', null, null, null, 'DW', null, null, null,],
      ['TL', null, null, null, 'DL', null, null, null, null, null, 'DL', null, null, null, 'TL',],
      [null, 'DW', null, null, null, 'TL', null, null, null, 'TL', null, null, null, 'DW', null,],
      [null, null, 'DL', null, null, null, 'DL', null, 'DL', null, null, null, 'DL', null, null,],
      ['TW', null, null, 'TL', null, null, null, 'DW', null, null, null, 'TL', null, null, 'TW',],
      [null, 'DL', null, null, 'DL', null, null, null, null, null, 'DL', null, null, 'DL', null,],
      [null, null, 'DL', null, null, 'DW', null, null, null, 'DW', null, null, 'DL', null, null,],
      [null, null, null, 'TW', null, null, 'TL', null, 'TL', null, null, 'TW', null, null, null,],
    ];

    const margin = 2;

    const tileCoordinates = [...tileMap];
    let tileCoordinatesCount = 0;

    const result = tileMap.map((row, rowIndex) => (
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
              onGrab={this.refs.letterBar && this.refs.letterBar.retakeLetter}
              onRender={(ref) => {
                ref.measure((x, y, width, height, pageX, pageY) => {
                  tileCoordinatesCount++;
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
                  };

                  let total = 0;
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
    ));

    return result;
  }

  checkTileMatching(nativeEvent, gesture) {
    console.log('Board.checkTileMatching')
    const { tileCoordinates } = this.state;
    const { zoomView } = this.refs;

    let result = null;

    let {
      scale,
      offsetX,
      offsetY,
    } = zoomView.getOffsets();

    const point = {
      x: (gesture.moveX - (offsetX * scale)),
      y: (gesture.moveY - (offsetY * scale))
    };

    if (nativeEvent.pageY > (height - 100)) {
      return null
    }

    tileCoordinates.forEach((row, rowIndex) => {
      row.forEach(({ rectangle, ...rest }, colIndex) => {
        const xOffsetFromCenter = (((rest.width) + 4) * (-8 + (colIndex + 1)))
        const yOffsetFromCenter = (((rest.height) + 4) * (-8 + (rowIndex + 1)))

        const x1 = (rectangle.x1 + (scale !== 1 ? xOffsetFromCenter : 0));
        const y1 = (rectangle.y1 + (scale !== 1 ? yOffsetFromCenter : 0));
        const x2 = x1 + ((rest.width * scale) + 4);
        const y2 = y1 + ((rest.height * scale) + 4);

        if (pointRectangleIntersection(point, { x2, x1, y1, y2, })) {
          result = {
            x: x1,
            y: y1,
            xOffsetFromCenter,
            yOffsetFromCenter,
            ...rest
          };
        }
      })
    });

    if (result) {
      const { [result.ref]: tileRef } = this.refs;

      return {
        ...result,
        handle: tileRef,
        isActive: tileRef.isActive(),
        zoom: () => {
          // const ref = result.ref.split('-')
          // const rowIndex = ref[1]
          // const columnIndex = ref[3]

          zoomView.zoom({
            offsetX: -result.xOffsetFromCenter,
            offsetY: -result.yOffsetFromCenter,
          });
        }
      }
    }

    return null;
  }

  render() {
    const { tileCoordinates } = this.state;

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
            <Text>Rendering the board...</Text>
          </View>
        }
        <PinchZoomView
          onViewChange={viewInfo => null}
          checkGrabZone={this.checkTileMatching}
          onDrag={this.refs.letterBar ? this.refs.letterBar.onDrag : null}
          onDrop={this.refs.letterBar ? this.refs.letterBar.onDrop : null}
          setDragStart={this.refs.letterBar ? (xy) => {
            this.refs.letterBar.setDragStart(xy);
          } : null}
          ref='zoomView'>
          {this.renderTiles()}
        </PinchZoomView>
        <LetterBar
          ref="letterBar"
          checkDropZone={this.checkTileMatching}
          initialLetters={[
            'ش',
            'ق',
            'ی',
            null,
            'ه',
            'ا',
            'س',
          ]}
        />

        {
          !!this.state.viewInfo &&
          <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 999999, backgroundColor: '#fff' }}>
            <Text>scaleAnimation: { JSON.stringify(this.state.viewInfo.scaleAnimation) }</Text>
            <Text>offsetX: { JSON.stringify(this.state.viewInfo.offsetX) }</Text>
            <Text>offsetY: { JSON.stringify(this.state.viewInfo.offsetY) }</Text>
            <Text>draggableX: { JSON.stringify(this.state.viewInfo.draggableX) }</Text>
            <Text>draggableY: { JSON.stringify(this.state.viewInfo.draggableY) }</Text>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width,
    height: width,
  }
});
