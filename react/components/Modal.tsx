import React from 'react'
import { pick } from 'ramda'
import styles from './styles.css'
import classnames from 'classnames'
import BaseModal from './BaseModal'
import ModalTitle from './ModalTitle'
import ModalContent from './ModalContent'
import { IconClose } from 'vtex.store-icons'
import { getValidTachyonsTokenNumber } from './utils'
import { useModalState, useModalDispatch } from './ModalContext'
import { useCssHandles, generateBlockClass } from 'vtex.css-handles'
import { useResponsiveValue, ResponsiveInput } from 'vtex.responsive-values'

interface Props {
  blockClass?: string
  title?: string | ResponsiveInput<string>
  titlePadding?: number | ResponsiveInput<number>
  hideBackdrop?: boolean | ResponsiveInput<boolean>
  contentPadding?: number | ResponsiveInput<number>
  showCloseButton?: boolean | ResponsiveInput<boolean>
  backdropInvisible?: boolean | ResponsiveInput<boolean>
  closeOnBackdropClick: boolean | ResponsiveInput<boolean>
}

const CSS_HANDLES = [
  'container',
  'closeButtonContainer',
  'closeButton',
]

const responsiveProps = [
  'titlePadding',
  'contentPadding',
  'showCloseButton',
  'closeOnBackdropClick'
] as const

const Modal: React.FC<Props> = props => {
  const {
    title,
    children,
    blockClass,
    hideBackdrop,
    backdropInvisible,
  } = props

  const {
    showCloseButton = true,
    closeOnBackdropClick = true,
    titlePadding: titlePaddingProp = 5,
    contentPadding: contentPaddingProp = 5,
  } = useResponsiveValue(pick(responsiveProps, props))

  const handles = useCssHandles(CSS_HANDLES)
  const context = useModalState()
  const dispatch = useModalDispatch()

  const handleClose = () => {
    if (dispatch) {
      dispatch({
        type: 'CLOSE_MODAL',
      })
    }
  }

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      handleClose()
    }
  }

  const titlePadding = getValidTachyonsTokenNumber(titlePaddingProp)
  const contentPadding = getValidTachyonsTokenNumber(contentPaddingProp)

  const titleClasses = showCloseButton ? `ph${titlePadding}` : `ph${titlePadding} pt${titlePadding}`
  let contentClasses = ''

  if (title || !showCloseButton) {
    contentClasses = `pa${contentPadding}`
  } else if (showCloseButton) {
    contentClasses = `ph${contentPadding} pb${contentPadding}`
  }

  const blockClassContainer = generateBlockClass(styles.container, blockClass)
  const containerClasses = classnames(blockClassContainer, 'bg-base relative flex flex-column')
  const closeButtonContainerClasses = classnames(handles.closeButtonContainer, 'w-100 flex justify-end')
  const closeButtonClasses = classnames(handles.closeButton, 'ma0 bg-transparent pointer bw0 pa2')

  return (
    <BaseModal
      open={context.open}
      hideBackdrop={hideBackdrop}
      onBackdropClick={handleBackdropClick}
      backdropInvisible={backdropInvisible}
    >
      <div className={containerClasses} style={styles.root}>
        {showCloseButton && (
          <div className={closeButtonContainerClasses}>
            <button className={closeButtonClasses} onClick={handleClose}>
              <IconClose size={24} type="line" />
            </button>
          </div>
        )}
        {title && (
          <ModalTitle className={titleClasses}>{title}</ModalTitle>
        )}
        <ModalContent className={contentClasses}>
          {children}
        </ModalContent>
      </div>
    </BaseModal>
  )
}

export default Modal
