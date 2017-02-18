import React from 'react';
import _ from 'lodash';
import ItemList from '../item-list/item-list';
import './update.css'

export default function Update({
  index,
  style,
  item,
  onItemClick,
}) {

  const { content } = item;

  return (
    <div
      className='bong-rotate'
      style={_.merge(style, styles.row, {
        color: `hsl(${(index * (360 / 120) % 360)},100%,50%)`,
      })}
    >
      <span>{content}</span>
    </div>
  )
}

const styles =  {
  row: {
    paddingTop: 50,
    paddingLeft: 30,
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bolder',
    display: 'flex',
    borderTop: '10px solid #222',
    borderBotttom: '10px solid #222',
    background: '#111',
  }
}
