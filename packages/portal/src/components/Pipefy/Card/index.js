import classNames from 'classnames'
import React, { useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import BoardContext from '../Board/context'

export default ({ data, index, listIndex }) => {
  const { move } = useContext(BoardContext)
  const ref = useRef()
  const [{ isDragging }, dragRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    item: {
      data,
      index,
      listIndex,
      type: 'CARD'
    }
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover (item, monitor) {
      const draggedListIndex = item.listIndex
      const targetListIndex = listIndex
      const draggedIndex = item.index
      const targetIndex = index

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return
      }

      const targetSize = ref.current.getBoundingClientRect()
      const targetCenter = (targetSize.bottom - targetSize.top) / 2

      const draggedOffSet = monitor.getClientOffset()
      const draggetTop = draggedOffSet.y - targetSize.top

      if (draggedIndex < targetIndex && draggetTop < targetCenter) {
        return
      }

      if (draggedIndex > targetIndex && draggetTop > targetCenter) {
        return
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex)

      item.index = targetIndex
      item.listIndex = targetListIndex
    }
  })

  dragRef(dropRef(ref))

  const labels = data.labels || []

  return (
    <div className={classNames('pipefy__card', {
      isDragging
    })} ref={ref}>
      <header>
        {labels.map(label => (<label key={label} style={{ backgroundColor: label }} />))}
      </header>
      <p>{data.content}</p>
      <img src={data.user || 'https://api.adorable.io/avatars/285/abott@adorable.io.png'} alt=""></img>
    </div>
  )
}
