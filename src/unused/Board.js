/** @flow */
import React, { Component } from 'react'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { AutoSizer, Grid, ScrollSync } from 'react-virtualized'

import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'


const LEFT_COLOR_FROM = hexToRgb('#471061')
const LEFT_COLOR_TO = hexToRgb('#BC3959')
const TOP_COLOR_FROM = hexToRgb('#000000')
const TOP_COLOR_TO = hexToRgb('#333333')

export default class Board extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      columnWidth: 175,
      columnCount: 15,
      height: window.innerHeight,
      overscanColumnCount: 0,
      overscanRowCount: 50,
      rowHeight: 40,
      rowCount: 12000
    }

    this._renderBodyCell = this._renderBodyCell.bind(this)
    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this)
  }

  render () {
    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount
    } = this.state

    return (
      <div>
        <ScrollSync>
          {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => {
            const x = scrollLeft / (scrollWidth - clientWidth)
            const y = scrollTop / (scrollHeight - clientHeight)

            const leftBackgroundColor = mixColors(LEFT_COLOR_FROM, LEFT_COLOR_TO, y)
            const leftColor = '#ffffff'
            const topBackgroundColor = mixColors(TOP_COLOR_FROM, TOP_COLOR_TO, x)
            const topColor = '#ffffff'
            const middleBackgroundColor = mixColors(leftBackgroundColor, topBackgroundColor, 0.5)
            const middleColor = '#ffffff'

            return (
              <div >
                <div
                  // className={styles.LeftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: leftColor,
                    backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`
                  }}
                >
                  <Grid
                    cellRenderer={this._renderLeftHeaderCell}
                    // className={styles.HeaderGrid}
                    width={columnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={columnWidth}
                    rowCount={1}
                    columnCount={1}
                  />
                </div>
                <div
                  // className={styles.LeftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rowHeight,
                    color: leftColor,
                    backgroundColor: `rgb(${leftBackgroundColor.r},${leftBackgroundColor.g},${leftBackgroundColor.b})`
                  }}
                >
                  <Grid
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    cellRenderer={this._renderLeftSideCell}
                    columnWidth={columnWidth}
                    columnCount={1}
                    // className={styles.LeftSideGrid}
                    height={height - 4}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    scrollTop={scrollTop}
                    width={columnWidth}
                  />
                </div>
                <div >
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <div>
                        <div style={{
                          backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                          color: topColor,
                          height: rowHeight,
                          width: width - 4
                        }}>
                          <Grid
                            // className={styles.HeaderGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={this._renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - 4}
                          />
                        </div>
                        <div
                          style={{
                            backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            color: middleColor,
                            height,
                            width
                          }}
                        >
                          <Grid
                            // className={styles.BodyGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={height}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={this._renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
                            width={width}
                          />
                        </div>
                      </div>
                    )}
                  </AutoSizer>
                </div>
              </div>
            )
          }}
        </ScrollSync>
      </div>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _renderBodyCell ({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return
    }

    return this._renderLeftSideCell({ columnIndex, key, rowIndex, style })
  }

  _renderHeaderCell ({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return
    }

    return this._renderLeftHeaderCell({ columnIndex, key, rowIndex, style })
  }

  _renderLeftHeaderCell ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        // className={styles.headerCell}
        key={key}
        style={style}
      >
        {`C${columnIndex}`}
      </div>
    )
  }

  _renderLeftSideCell ({ columnIndex, key, rowIndex, style }) {
    // const rowClass = rowIndex % 2 === 0
    //   ? columnIndex % 2 === 0 ? styles.evenRow : styles.oddRow
    //   : columnIndex % 2 !== 0 ? styles.evenRow : styles.oddRow
    // const classNames = cn(rowClass, styles.cell)

    return (
      <div
        // className={classNames}
        key={key}
        style={style}
      >
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    )
  }
}

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors (color1, color2, amount) {
  const weight1 = amount
  const weight2 = 1 - amount

  const r = Math.round(weight1 * color1.r + weight2 * color2.r)
  const g = Math.round(weight1 * color1.g + weight2 * color2.g)
  const b = Math.round(weight1 * color1.b + weight2 * color2.b)

  return { r, g, b }
}
