// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useBoolean, useMergedRefs, useConst, useSetTimeout, useId, useUnmount } from '@fluentui/react-hooks';
import {
  allowOverscrollOnElement,
  allowScrollOnElement,
  AnimationVariables,
  classNamesFunction,
  DirectionalHint,
  elementContains,
  EventGroup,
  FocusTrapZone,
  getGlobalClassNames,
  getPropsWithDefaults,
  Icon,
  IDragOptions,
  IFocusTrapZone,
  ILayerProps,
  IModalProps,
  IModalStyleProps,
  IModalStyles,
  KeyCodes,
  Layer,
  memoizeFunction,
  mergeStyles,
  on,
  Overlay,
  Popup,
  ResponsiveMode,
  styled,
  useResponsiveMode,
  ZIndexes
} from '@fluentui/react';
import { useWindow } from '@fluentui/react-window-provider';

// @TODO - need to change this to a panel whenever the breakpoint is under medium (verify the spec)

/** @internal */
export interface _ExtendedIModalProps extends IModalProps {
  minDragPosition?: _ICoordinates;
  maxDragPosition?: _ICoordinates;
}

const animationDuration = AnimationVariables.durationValue2;
/** @internal */
export type _ICoordinates = { x: number; y: number };

interface IModalInternalState {
  onModalCloseTimer: number;
  allowTouchBodyScroll?: boolean;
  scrollableContent: HTMLDivElement | null;
  lastSetCoordinates: _ICoordinates;
  /** Minimum clamped position, if dragging and clamping (`dragOptions.keepInBounds`) are enabled */
  minPosition?: _ICoordinates;
  /** Maximum clamped position, if dragging and clamping (`dragOptions.keepInBounds`) are enabled */
  maxPosition?: _ICoordinates;
  events: EventGroup;
  /** Ensures we dispose the same keydown callback as was registered */
  disposeOnKeyDown?: () => void;
  /** Ensures we dispose the same keyup callback as was registered (also tracks whether keyup has been registered) */
  disposeOnKeyUp?: () => void;
  isInKeyboardMoveMode?: boolean;
  hasBeenOpened?: boolean;
}

const ZERO: _ICoordinates = { x: 0, y: 0 };

const DEFAULT_PROPS: Partial<_ExtendedIModalProps> = {
  isOpen: false,
  isDarkOverlay: true,
  className: '',
  containerClassName: '',
  enableAriaHiddenSiblings: true
};

const getModalClassNames = classNamesFunction<IModalStyleProps, IModalStyles>();

const getMoveDelta = (ev: React.KeyboardEvent<HTMLElement>): number => {
  let delta = 10;
  if (ev.shiftKey) {
    if (!ev.ctrlKey) {
      delta = 50;
    }
  } else if (ev.ctrlKey) {
    delta = 1;
  }

  return delta;
};

const useComponentRef = (props: IModalProps, focusTrapZone: React.RefObject<IFocusTrapZone>) => {
  React.useImperativeHandle(
    props.componentRef,
    () => ({
      focus() {
        if (focusTrapZone.current) {
          focusTrapZone.current.focus();
        }
      }
    }),
    [focusTrapZone]
  );
};

const ModalBase: React.FunctionComponent<_ExtendedIModalProps> = React.forwardRef<HTMLDivElement, _ExtendedIModalProps>(
  (propsWithoutDefaults, ref) => {
    const props = getPropsWithDefaults(DEFAULT_PROPS, propsWithoutDefaults);
    const {
      allowTouchBodyScroll,
      className,
      children,
      containerClassName,
      scrollableContentClassName,
      elementToFocusOnDismiss,
      firstFocusableSelector,
      forceFocusInsideTrap,
      ignoreExternalFocusing,
      isBlocking,
      isAlert,
      isClickableOutsideFocusTrap,
      isDarkOverlay,
      onDismiss,
      layerProps,
      overlay,
      isOpen,
      titleAriaId,
      styles,
      subtitleAriaId,
      theme,
      topOffsetFixed,
      responsiveMode,
      onLayerDidMount,
      isModeless,
      dragOptions,
      onDismissed,
      minDragPosition,
      maxDragPosition
    } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const focusTrapZone = React.useRef<IFocusTrapZone>(null);
    const focusTrapZoneElm = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(rootRef, ref);

    const modalResponsiveMode = useResponsiveMode(mergedRef);

    const focusTrapZoneId = useId('ModalFocusTrapZone');

    const win = useWindow();

    const { setTimeout, clearTimeout } = useSetTimeout();

    const [isModalOpen, setIsModalOpen] = React.useState(isOpen);
    const [isVisible, setIsVisible] = React.useState(isOpen);
    const [coordinates, setCoordinates] = React.useState<_ICoordinates>(ZERO);
    const [modalRectangleTop, setModalRectangleTop] = React.useState<number | undefined>();

    const [isModalMenuOpen, { toggle: toggleModalMenuOpen, setFalse: setModalMenuClose }] = useBoolean(false);

    const internalState = useConst<IModalInternalState>(() => ({
      onModalCloseTimer: 0,
      allowTouchBodyScroll,
      scrollableContent: null,
      lastSetCoordinates: ZERO,
      events: new EventGroup({})
    }));

    const { keepInBounds } = dragOptions || ({} as IDragOptions);
    const isAlertRole = isAlert ?? (isBlocking && !isModeless);

    const layerClassName = layerProps === undefined ? '' : layerProps.className;
    const classNames = getModalClassNames(styles, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      theme: theme!,
      className,
      containerClassName,
      scrollableContentClassName,
      isOpen,
      isVisible,
      hasBeenOpened: internalState.hasBeenOpened,
      modalRectangleTop,
      topOffsetFixed,
      isModeless,
      layerClassName,
      windowInnerHeight: win?.innerHeight,
      isDefaultDragHandle: dragOptions && !dragOptions.dragHandleSelector
    });

    const mergedLayerProps: ILayerProps = {
      eventBubblingEnabled: false,
      ...layerProps,
      onLayerDidMount: layerProps && layerProps.onLayerDidMount ? layerProps.onLayerDidMount : onLayerDidMount,
      insertFirst: isModeless,
      className: classNames.layer
    };

    // Allow the user to scroll within the modal but not on the body
    const allowScrollOnModal = React.useCallback(
      (elt: HTMLDivElement | null): void => {
        if (elt) {
          if (internalState.allowTouchBodyScroll) {
            allowOverscrollOnElement(elt, internalState.events);
          } else {
            allowScrollOnElement(elt, internalState.events);
          }
        } else {
          internalState.events.off(internalState.scrollableContent);
        }
        internalState.scrollableContent = elt;
      },
      [internalState]
    );

    const registerInitialModalPosition = (): void => {
      const dialogMain = focusTrapZoneElm.current;
      const modalRectangle = dialogMain?.getBoundingClientRect();

      if (modalRectangle) {
        if (topOffsetFixed) {
          setModalRectangleTop(modalRectangle.top);
        }

        if (keepInBounds) {
          // x/y are unavailable in IE, so use the equivalent left/top
          internalState.minPosition = minDragPosition ?? { x: -modalRectangle.left, y: -modalRectangle.top };
          internalState.maxPosition = maxDragPosition ?? { x: modalRectangle.left, y: modalRectangle.top };

          // Make sure the initial co-ordinates are within clamp bounds.
          setCoordinates({
            x: getClampedAxis('x', coordinates.x),
            y: getClampedAxis('y', coordinates.y)
          });
        }
      }
    };

    /**
     * Clamps an axis to a specified min and max position.
     *
     * @param axis A string that represents the axis (x/y).
     * @param position The position on the axis.
     */
    const getClampedAxis = React.useCallback(
      (axis: keyof _ICoordinates, position: number) => {
        const { minPosition, maxPosition } = internalState;
        if (keepInBounds && minPosition && maxPosition) {
          position = Math.max(minPosition[axis], position);
          position = Math.min(maxPosition[axis], position);
        }
        return position;
      },
      [keepInBounds, internalState]
    );

    const handleModalClose = (): void => {
      internalState.lastSetCoordinates = ZERO;

      setModalMenuClose();
      internalState.isInKeyboardMoveMode = false;
      setIsModalOpen(false);
      setCoordinates(ZERO);

      internalState.disposeOnKeyUp?.();

      onDismissed?.();
    };

    const handleDragStart = React.useCallback((): void => {
      setModalMenuClose();
      internalState.isInKeyboardMoveMode = false;
    }, [internalState, setModalMenuClose]);

    const handleDrag = React.useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev: React.MouseEvent<HTMLElement> & React.TouchEvent<HTMLElement>, dragData: any): void => {
        setCoordinates((prevValue) => ({
          x: getClampedAxis('x', prevValue.x + dragData.delta.x),
          y: getClampedAxis('y', prevValue.y + dragData.delta.y)
        }));
      },
      [getClampedAxis]
    );

    const handleDragStop = React.useCallback((): void => {
      if (focusTrapZone.current) {
        focusTrapZone.current.focus();
      }
    }, []);

    const handleEnterKeyboardMoveMode = () => {
      // We need a global handleKeyDown event when we are in the move mode so that we can
      // handle the key presses and the components inside the modal do not get the events
      const handleKeyDown = (ev: React.KeyboardEvent<HTMLElement>): void => {
        if (ev.altKey && ev.ctrlKey && ev.keyCode === KeyCodes.space) {
          // CTRL + ALT + SPACE is handled during keyUp
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }

        const newLocal = ev.altKey || ev.keyCode === KeyCodes.escape;
        if (isModalMenuOpen && newLocal) {
          setModalMenuClose();
        }

        if (internalState.isInKeyboardMoveMode && (ev.keyCode === KeyCodes.escape || ev.keyCode === KeyCodes.enter)) {
          internalState.isInKeyboardMoveMode = false;
          ev.preventDefault();
          ev.stopPropagation();
        }

        if (internalState.isInKeyboardMoveMode) {
          let handledEvent = true;
          const delta = getMoveDelta(ev);

          switch (ev.keyCode) {
            /* eslint-disable no-fallthrough */
            case KeyCodes.escape:
              setCoordinates(internalState.lastSetCoordinates);
            case KeyCodes.enter: {
              // TODO: determine if fallthrough was intentional
              /* eslint-enable no-fallthrough */
              internalState.lastSetCoordinates = ZERO;
              // setIsInKeyboardMoveMode(false);
              break;
            }
            case KeyCodes.up: {
              setCoordinates((prevValue) => ({ x: prevValue.x, y: getClampedAxis('y', prevValue.y - delta) }));
              break;
            }
            case KeyCodes.down: {
              setCoordinates((prevValue) => ({ x: prevValue.x, y: getClampedAxis('y', prevValue.y + delta) }));
              break;
            }
            case KeyCodes.left: {
              setCoordinates((prevValue) => ({ x: getClampedAxis('x', prevValue.x - delta), y: prevValue.y }));
              break;
            }
            case KeyCodes.right: {
              setCoordinates((prevValue) => ({ x: getClampedAxis('x', prevValue.x + delta), y: prevValue.y }));
              break;
            }
            default: {
              handledEvent = false;
            }
          }
          if (handledEvent) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        }
      };

      internalState.lastSetCoordinates = coordinates;
      setModalMenuClose();
      internalState.isInKeyboardMoveMode = true;

      internalState.events.on(win, 'keydown', handleKeyDown, true /* useCapture */);
      internalState.disposeOnKeyDown = () => {
        internalState.events.off(win, 'keydown', handleKeyDown, true /* useCapture */);
        internalState.disposeOnKeyDown = undefined;
      };
    };

    const handleExitKeyboardMoveMode = () => {
      internalState.lastSetCoordinates = ZERO;
      internalState.isInKeyboardMoveMode = false;
      internalState.disposeOnKeyDown?.();
    };

    const registerForKeyUp = (): void => {
      const handleKeyUp = (ev: React.KeyboardEvent<HTMLElement>): void => {
        // Needs to handle the CTRL + ALT + SPACE key during keyup due to FireFox bug:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1220143
        if (ev.altKey && ev.ctrlKey && ev.keyCode === KeyCodes.space) {
          if (elementContains(internalState.scrollableContent, ev.target as HTMLElement)) {
            toggleModalMenuOpen();
            ev.preventDefault();
            ev.stopPropagation();
          }
        }
      };

      if (!internalState.disposeOnKeyUp) {
        internalState.events.on(win, 'keyup', handleKeyUp, true /* useCapture */);
        internalState.disposeOnKeyUp = () => {
          internalState.events.off(win, 'keyup', handleKeyUp, true /* useCapture */);
          internalState.disposeOnKeyUp = undefined;
        };
      }
    };

    React.useEffect(() => {
      clearTimeout(internalState.onModalCloseTimer);
      // Opening the dialog
      if (isOpen) {
        // This must be done after the modal content has rendered
        requestAnimationFrame(() => setTimeout(registerInitialModalPosition, 0));

        setIsModalOpen(true);

        // Add a keyUp handler for all key up events once the dialog is open.
        if (dragOptions) {
          registerForKeyUp();
        }

        internalState.hasBeenOpened = true;
        setIsVisible(true);
      }

      // Closing the dialog
      if (!isOpen && isModalOpen) {
        internalState.onModalCloseTimer = setTimeout(handleModalClose, parseFloat(animationDuration) * 1000);
        setIsVisible(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- should only run if isModalOpen or isOpen mutates or if min/max drag bounds are updated.
    }, [isModalOpen, isOpen, minDragPosition, maxDragPosition]);

    useUnmount(() => {
      internalState.events.dispose();
    });

    useComponentRef(props, focusTrapZone);

    const modalContent = (
      <FocusTrapZone
        disabled={true}
        id={focusTrapZoneId}
        ref={focusTrapZoneElm}
        componentRef={focusTrapZone}
        className={classNames.main}
        elementToFocusOnDismiss={elementToFocusOnDismiss}
        isClickableOutsideFocusTrap={isModeless || isClickableOutsideFocusTrap || !isBlocking}
        ignoreExternalFocusing={ignoreExternalFocusing}
        forceFocusInsideTrap={forceFocusInsideTrap && !isModeless}
        firstFocusableSelector={firstFocusableSelector}
        focusPreviouslyFocusedInnerElement
        onBlur={internalState.isInKeyboardMoveMode ? handleExitKeyboardMoveMode : undefined}
        data-ui-id={props['data-ui-id']}
        // enableAriaHiddenSiblings is handled by the Popup
      >
        {dragOptions && internalState.isInKeyboardMoveMode && (
          <div className={classNames.keyboardMoveIconContainer}>
            {dragOptions.keyboardMoveIconProps ? (
              <Icon {...dragOptions.keyboardMoveIconProps} />
            ) : (
              <Icon iconName="move" className={classNames.keyboardMoveIcon} />
            )}
          </div>
        )}
        <div ref={allowScrollOnModal} className={classNames.scrollableContent} data-is-scrollable>
          {dragOptions && isModalMenuOpen && (
            <dragOptions.menu
              items={[
                { key: 'move', text: dragOptions.moveMenuItemText, onClick: handleEnterKeyboardMoveMode },
                { key: 'close', text: dragOptions.closeMenuItemText, onClick: handleModalClose }
              ]}
              onDismiss={setModalMenuClose}
              alignTargetEdge
              coverTarget
              directionalHint={DirectionalHint.topLeftEdge}
              directionalHintFixed
              shouldFocusOnMount
              target={internalState.scrollableContent}
            />
          )}
          {children}
        </div>
      </FocusTrapZone>
    );

    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (isModalOpen && modalResponsiveMode! >= (responsiveMode || ResponsiveMode.small) && (
        <Layer ref={mergedRef} {...mergedLayerProps}>
          <Popup
            role={isAlertRole ? 'alertdialog' : 'dialog'}
            ariaLabelledBy={titleAriaId}
            ariaDescribedBy={subtitleAriaId}
            // onDismiss={onDismiss}
            shouldRestoreFocus={!ignoreExternalFocusing}
            // Modeless modals shouldn't hide siblings.
            // Popup will automatically handle this based on the aria-modal setting.
            // enableAriaHiddenSiblings={enableAriaHiddenSiblings}
            aria-modal={!isModeless}
          >
            <div className={classNames.root} role={!isModeless ? 'document' : undefined}>
              {!isModeless && (
                <Overlay
                  aria-hidden={true}
                  isDarkThemed={isDarkOverlay}
                  onClick={isBlocking ? undefined : onDismiss}
                  allowTouchBodyScroll={allowTouchBodyScroll}
                  {...overlay}
                />
              )}
              {dragOptions ? (
                <DraggableZone
                  handleSelector={dragOptions.dragHandleSelector || `#${focusTrapZoneId}`}
                  preventDragSelector="button"
                  onStart={handleDragStart}
                  onDragChange={handleDrag}
                  onStop={handleDragStop}
                  position={coordinates}
                >
                  {modalContent}
                </DraggableZone>
              ) : (
                modalContent
              )}
            </div>
          </Popup>
        </Layer>
      )) ||
      null
    );
  }
);
ModalBase.displayName = 'ModalBase';

interface IDraggableZoneStyles {
  root: string;
}

const getDraggableZoneClassNames = memoizeFunction((className: string, isDragging: boolean): IDraggableZoneStyles => {
  return {
    root: mergeStyles(
      className,
      isDragging && {
        touchAction: 'none',
        selectors: {
          '& *': {
            userSelect: 'none'
          }
        }
      }
    )
  };
});

interface IDragData {
  position: _ICoordinates;
  lastPosition?: _ICoordinates;
  delta: _ICoordinates;
}

interface IDraggableZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies a selector to be used as the handle that initiates drag
   */
  handleSelector?: string;

  /**
   * Specifies a selector to be used to prevent drag initialization.
   * For example, if you do not want buttons inside of your handleSelector
   * to have the cursor change to move or to allow users to select from buttons,
   * you could pass button here (the close button in the header of a dialog is a concrete example)
   */
  preventDragSelector?: string;

  /**
   * the X and Y coordinates to use as an offest to position the draggable content
   */
  position?: _ICoordinates;

  /**
   * Callback for when dragging starts
   */
  onStart?: (event: React.MouseEvent<HTMLElement> & React.TouchEvent<HTMLElement>, dragData: IDragData) => void;

  /**
   * Callback for when the drag changes, while dragging
   */
  onDragChange?: (event: React.MouseEvent<HTMLElement> & React.TouchEvent<HTMLElement>, dragData: IDragData) => void;

  /**
   * Callback for when dragging stops
   */
  onStop?: (event: React.MouseEvent<HTMLElement> & React.TouchEvent<HTMLElement>, dragData: IDragData) => void;
}

interface IDraggableZoneState {
  isDragging: boolean;
  position: _ICoordinates;
  lastPosition?: _ICoordinates;
}

const eventMapping = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
};

// These are needed so that we can generalize the events
// and so we have access to clientX and clientY in the touch events
type MouseTouchEvent<T> = React.MouseEvent<T> & React.TouchEvent<T> & Event;

class DraggableZone extends React.Component<IDraggableZoneProps, IDraggableZoneState> {
  private _touchId?: number;
  private _currentEventType = eventMapping.mouse;
  private _events: (() => void)[] = [];

  constructor(props: IDraggableZoneProps) {
    super(props);

    this.state = {
      isDragging: false,
      position: this.props.position || { x: 0, y: 0 },
      lastPosition: undefined
    };
  }

  public componentDidUpdate(prevProps: IDraggableZoneProps) {
    if (this.props.position && (!prevProps.position || this.props.position !== prevProps.position)) {
      this.setState({ position: this.props.position });
    }
  }

  public componentWillUnmount() {
    this._events.forEach((dispose) => dispose());
  }

  public render() {
    const child: any = React.Children.only(this.props.children);
    const { props } = child;
    const { position } = this.props;
    const { position: statePosition, isDragging } = this.state;
    let x = statePosition.x;
    let y = statePosition.y;

    if (position && !isDragging) {
      x = position.x;
      y = position.y;
    }

    return React.cloneElement(child, {
      style: {
        ...props.style,
        transform: `translate(${x}px, ${y}px)`
      },
      className: getDraggableZoneClassNames(props.className, this.state.isDragging).root,
      onMouseDown: this._onMouseDown,
      onMouseUp: this._onMouseUp,
      onTouchStart: this._onTouchStart,
      onTouchEnd: this._onTouchEnd
    });
  }

  private _onMouseDown = (event: MouseTouchEvent<HTMLElement>) => {
    const onMouseDown = (React.Children.only(this.props.children) as any).props.onMouseDown;
    if (onMouseDown) {
      onMouseDown(event);
    }

    this._currentEventType = eventMapping.mouse;
    return this._onDragStart(event);
  };

  private _onMouseUp = (event: MouseTouchEvent<HTMLElement>) => {
    const onMouseUp = (React.Children.only(this.props.children) as any).props.onMouseUp;
    if (onMouseUp) {
      onMouseUp(event);
    }

    this._currentEventType = eventMapping.mouse;
    return this._onDragStop(event);
  };

  private _onTouchStart = (event: MouseTouchEvent<HTMLElement>) => {
    const onTouchStart = (React.Children.only(this.props.children) as any).props.onTouchStart;
    if (onTouchStart) {
      onTouchStart(event);
    }

    this._currentEventType = eventMapping.touch;
    return this._onDragStart(event);
  };

  private _onTouchEnd = (event: MouseTouchEvent<HTMLElement>) => {
    const onTouchEnd = (React.Children.only(this.props.children) as any).props.onTouchEnd;
    if (onTouchEnd) {
      onTouchEnd(event);
    }

    this._currentEventType = eventMapping.touch;
    this._onDragStop(event);
  };

  private _onDragStart = (event: MouseTouchEvent<HTMLElement>) => {
    // Only handle left click for dragging
    if (typeof event.button === 'number' && event.button !== 0) {
      return false;
    }

    // If the target doesn't match the handleSelector OR
    // if the target does match the preventDragSelector, bail out
    if (
      (this.props.handleSelector && !this._matchesSelector(event.target as HTMLElement, this.props.handleSelector)) ||
      (this.props.preventDragSelector &&
        this._matchesSelector(event.target as HTMLElement, this.props.preventDragSelector))
    ) {
      return;
    }

    // Remember the touch identifier if this is a touch event so we can
    // distinguish between individual touches in multitouch scenarios
    // by remembering which touch point we were given
    this._touchId = this._getTouchId(event);

    const position = this._getControlPosition(event);
    if (position === undefined) {
      return;
    }

    const dragData = this._createDragDataFromPosition(position);
    this.props.onStart && this.props.onStart(event, dragData);

    this.setState({
      isDragging: true,
      lastPosition: position
    });

    // hook up the appropriate mouse/touch events to the body to ensure
    // smooth dragging
    this._events = [
      on(document.body, this._currentEventType.move, this._onDrag, true /* use capture phase */),
      on(document.body, this._currentEventType.stop, this._onDragStop, true /* use capture phase */)
    ];

    return;
  };

  private _onDrag = (event: any) => {
    // Prevent scrolling on mobile devices
    if (event.type === 'touchmove') {
      event.preventDefault();
    }

    const position = this._getControlPosition(event);
    if (!position) {
      return;
    }

    // create the updated drag data from the position data
    const updatedData = this._createUpdatedDragData(this._createDragDataFromPosition(position));
    const updatedPosition = updatedData.position;

    this.props.onDragChange && this.props.onDragChange(event, updatedData);

    this.setState({
      position: updatedPosition,
      lastPosition: position
    });
  };

  private _onDragStop = (event: any) => {
    if (!this.state.isDragging) {
      return;
    }

    const position = this._getControlPosition(event);
    if (!position) {
      return;
    }

    const baseDragData = this._createDragDataFromPosition(position);

    // Set dragging to false and reset the lastPosition
    this.setState({
      isDragging: false,
      lastPosition: undefined
    });

    this.props.onStop && this.props.onStop(event, baseDragData);

    if (this.props.position) {
      this.setState({
        position: this.props.position
      });
    }

    // Remove event handlers
    this._events.forEach((dispose) => dispose());
  };

  /**
   * Get the control position based off the event that fired
   * @param event - The event to get offsets from
   */
  private _getControlPosition(event: MouseTouchEvent<HTMLElement>): _ICoordinates | undefined {
    const touchObj = this._getActiveTouch(event);

    // did we get the right touch?
    if (this._touchId !== undefined && !touchObj) {
      return undefined;
    }

    const eventToGetOffset = touchObj || event;
    return {
      x: eventToGetOffset.clientX,
      y: eventToGetOffset.clientY
    };
  }

  /**
   * Get the active touch point that we have saved from the event's TouchList
   * @param event - The event used to get the TouchList for the active touch point
   */
  private _getActiveTouch(event: MouseTouchEvent<HTMLElement>): React.Touch | undefined {
    return (
      (event.targetTouches && this._findTouchInTouchList(event.targetTouches)) ||
      (event.changedTouches && this._findTouchInTouchList(event.changedTouches))
    );
  }

  /**
   * Get the initial touch identifier associated with the given event
   * @param event - The event that contains the TouchList
   */
  private _getTouchId(event: MouseTouchEvent<HTMLElement>): number | undefined {
    const touch: React.Touch | undefined =
      (event.targetTouches && event.targetTouches[0]) || (event.changedTouches && event.changedTouches[0]);

    if (touch) {
      return touch.identifier;
    }

    return;
  }

  /**
   * Returns if an element (or any of the element's parents) match the given selector
   */
  private _matchesSelector(element: HTMLElement | null, selector: string): boolean {
    if (!element || element === document.body) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const matchesSelectorFn: Function =
      element.matches || element.webkitMatchesSelector || (element as any).msMatchesSelector; /* for IE */

    if (!matchesSelectorFn) {
      return false;
    }

    return matchesSelectorFn.call(element, selector) || this._matchesSelector(element.parentElement, selector);
  }

  /**
   * Attempts to find the Touch that matches the identifier  we stored in dragStart
   * @param touchList The TouchList to look for the stored identifier from dragStart
   */
  private _findTouchInTouchList(touchList: React.TouchList): React.Touch | undefined {
    if (this._touchId === undefined) {
      return;
    }

    for (let i = 0; i < touchList.length; i++) {
      if (touchList[i].identifier === this._touchId) {
        return touchList[i];
      }
    }

    return undefined;
  }

  /**
   * Create DragData based off of the last known position and the new position passed in
   * @param position The new position as part of the drag
   */
  private _createDragDataFromPosition(position: _ICoordinates): IDragData {
    const { lastPosition } = this.state;

    // If we have no lastPosition, use the given position
    // for last position
    if (lastPosition === undefined) {
      return {
        delta: { x: 0, y: 0 },
        lastPosition: position,
        position
      };
    }

    return {
      delta: {
        x: position.x - lastPosition.x,
        y: position.y - lastPosition.y
      },
      lastPosition,
      position
    };
  }

  /**
   * Creates an updated DragData based off the current position and given baseDragData
   * @param baseDragData The base DragData (from _createDragDataFromPosition) used to calculate the updated positions
   */
  private _createUpdatedDragData(baseDragData: IDragData): IDragData {
    const { position } = this.state;
    return {
      position: {
        x: position.x + baseDragData.delta.x,
        y: position.y + baseDragData.delta.y
      },
      delta: baseDragData.delta,
      lastPosition: position
    };
  }
}

const globalClassNames = {
  root: 'ms-Modal',
  main: 'ms-Dialog-main',
  scrollableContent: 'ms-Modal-scrollableContent',
  isOpen: 'is-open',
  layer: 'ms-Modal-Layer'
};

const getStyles = (props: IModalStyleProps): IModalStyles => {
  const {
    className,
    containerClassName,
    scrollableContentClassName,
    isOpen,
    isVisible,
    hasBeenOpened,
    modalRectangleTop,
    theme,
    topOffsetFixed,
    isModeless,
    layerClassName,
    isDefaultDragHandle,
    windowInnerHeight
  } = props;
  const { palette, effects, fonts } = theme;

  const classNames = getGlobalClassNames(globalClassNames, theme);

  return {
    root: [
      classNames.root,
      fonts.medium,
      {
        backgroundColor: 'transparent',
        position: isModeless ? 'absolute' : 'fixed',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}`
      },
      topOffsetFixed &&
        typeof modalRectangleTop === 'number' &&
        hasBeenOpened && {
          alignItems: 'flex-start'
        },
      isOpen && classNames.isOpen,
      isVisible && {
        opacity: 1,
        pointerEvents: 'auto'
      },
      className
    ],
    main: [
      classNames.main,
      {
        boxShadow: effects.elevation64,
        borderRadius: effects.roundedCorner2,
        backgroundColor: palette.white,
        boxSizing: 'border-box',
        position: 'relative',
        textAlign: 'left',
        outline: '3px solid transparent',
        maxHeight: 'calc(100% - 32px)',
        maxWidth: 'calc(100% - 32px)',
        minHeight: '176px',
        minWidth: '288px',
        overflowY: 'auto',
        zIndex: isModeless ? ZIndexes.Layer : undefined
      },
      topOffsetFixed &&
        typeof modalRectangleTop === 'number' &&
        hasBeenOpened && {
          top: modalRectangleTop
        },
      isDefaultDragHandle && {
        cursor: 'move'
      },
      containerClassName
    ],
    scrollableContent: [
      classNames.scrollableContent,
      {
        overflowY: 'auto',
        flexGrow: 1,
        maxHeight: '100vh',
        selectors: {
          ['@supports (-webkit-overflow-scrolling: touch)']: {
            maxHeight: windowInnerHeight
          }
        }
      },
      scrollableContentClassName
    ],
    layer: isModeless && [
      layerClassName,
      classNames.layer,
      {
        position: 'static',
        width: 'unset',
        height: 'unset'
      }
    ],
    keyboardMoveIconContainer: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: '3px 0px'
    },
    keyboardMoveIcon: {
      fontSize: fonts.xLargePlus.fontSize,
      width: '24px'
    }
  };
};

/** @internal */
export const _ModalClone: React.FunctionComponent<_ExtendedIModalProps> = styled<
  _ExtendedIModalProps,
  IModalStyleProps,
  IModalStyles
>(ModalBase, getStyles, undefined, {
  scope: 'Modal',
  fields: ['theme', 'styles', 'enableAriaHiddenSiblings']
});
_ModalClone.displayName = 'Modal';
