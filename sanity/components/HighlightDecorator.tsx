import React from 'react'
import { BlockDecoratorProps } from 'sanity'
import styles from './highlight.module.css'

const HighlightDecorator = (props: BlockDecoratorProps) => {
  return (
    <span className={styles.highlight}>
      {props.children}
    </span>
  )
}

export default HighlightDecorator