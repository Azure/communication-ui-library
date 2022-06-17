// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import EventEmitter from 'events';
import {
  DEFAULT_PAN_DISTANCE,
  DEFAULT_TRANSFORMATION_OBJECT,
  FULL_SIZE,
  MIN_EXISTING_TRANSFORMATION_STYLES,
  ZOOM_LEVELS
} from './PanZoomManager.constants';
import { Coordinate, LayoutTransformation, RelativeTransformation, ZoomAction } from './PanZoomManager.types';

/**
 * Given an element, this manager binds appropriate mouse/key down, scroll etc. events to support panning and zoom.
 *
 * Use `on('panZoomChange', callback)` to listen to pan/zoom changes.
 * Unsubscribe with `off('panZoomChange', callback)`.
 *
 * @private
 */
export class PanZoomManager {
  private element: HTMLElement;
  private emitter: EventEmitter = new EventEmitter();

  // Coordinates are mirrored when dragging via mouse vs using keyboard arrow keys
  private shouldMirrorCoordinates = false;

  // Track current zoom level
  private currentZoomLevel = 0;

  // Track starting transform position for mouse drag events
  private currentTransformStart: Coordinate = { x: 0, y: 0 };

  // Track diff from the starting transform position for mouse drag events
  private currentTransformDiff: Coordinate = { x: 0, y: 0 };

  public constructor(element: HTMLElement) {
    this.element = element;
    this.addTriggerEventListeners();
  }

  public dispose(): void {
    this.removeEventListeners();
  }

  public on(event: 'panZoomChange', callback: (transformation: LayoutTransformation) => void): void {
    this.emitter.on(event, callback);
  }

  public off(event: 'panZoomChange', callback: (transformation: LayoutTransformation) => void): void {
    this.emitter.off(event, callback);
  }

  /** Reset panning and scaling levels to initials */
  public reset(): void {
    if (this.currentZoomLevel !== 0) {
      this.zoom(ZoomAction.Reset);
    }
  }

  /** Resets panning levels to initials */
  public resetZoomLevels(): void {
    this.emitChange(DEFAULT_TRANSFORMATION_OBJECT);
  }

  private emitChange(transformation: LayoutTransformation): void {
    this.emitter.emit('panZoomChange', transformation);
  }

  /** Binds the necessary events to listen to pan and zoom changes */
  private addTriggerEventListeners(): void {
    this.element.addEventListener('wheel', this.onMouseWheel, {
      capture: true,
      passive: false
    });
    this.element.addEventListener('keydown', this.onKeyboardEvent, {
      capture: true,
      passive: false
    });
    this.element.addEventListener('mousedown', this.onMouseDown, false);
    this.element.addEventListener('touchstart', this.onTouchStart, false);
  }

  private removeEventListeners(): void {
    this.element.removeEventListener('wheel', this.onMouseWheel, true);
    this.element.removeEventListener('mousedown', this.onMouseDown, false);
    this.element.removeEventListener('mouseup', this.onMouseUp, false);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('keydown', this.onKeyboardEvent, true);
    this.element.removeEventListener('touchstart', this.onTouchStart, false);
    this.element.removeEventListener('touchend', this.onTouchEnd, false);
    this.element.removeEventListener('touchmove', this.onTouchMoveHandler, false);
    this.element.removeEventListener('mouseleave', this.onMouseLeave, false);
    // this.zoomThrottled.cancel();
    // this.sendTransformationToParentThrottled.cancel();
  }

  /** Calculate the mirroring coordinates used when switching from mouse to keyboard */
  private calculateAndSetMirrorCoordinates(): void {
    if (!this.shouldMirrorCoordinates || !this.element) {
      return;
    }

    const existingTransformations = getExistingTransformations(this.element);

    this.currentTransformDiff = {
      x: this.element.clientWidth * ((FULL_SIZE - existingTransformations.relativeX) / FULL_SIZE),
      y: this.element.clientHeight * ((FULL_SIZE - existingTransformations.relativeY) / FULL_SIZE)
    };
    this.shouldMirrorCoordinates = false;
  }

  /** Mark the initial mouse positioning when element is clicked */
  private onMouseDown = (event: MouseEvent): void => {
    stopEventPropagation(event);

    this.calculateAndSetMirrorCoordinates();

    this.currentTransformStart = {
      x: event.pageX - this.currentTransformDiff.x,
      y: event.pageY - this.currentTransformDiff.y
    };

    this.element.addEventListener('mouseup', this.onMouseUp, false);
    this.element.addEventListener('mousemove', this.onMouseMove, false);
    this.element.addEventListener('mouseleave', this.onMouseLeave, false);
  };

  /** Mark the difference from mouse down event when mouse moves */
  private onMouseMove = (event: MouseEvent): void => {
    stopEventPropagation(event);

    this.currentTransformDiff = {
      x: event.pageX - this.currentTransformStart.x,
      y: event.pageY - this.currentTransformStart.y
    };

    this.validatePositionAndPan();
  };

  /** Cleanups the listeners added on mouse down event */
  private onMouseUp = (): void => {
    this.element.removeEventListener('mouseup', this.onMouseUp, false);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('mouseleave', this.onMouseLeave, false);
  };

  /** Cleanup the listeners added on mouse down event */
  private onMouseLeave = (): void => {
    this.onMouseUp();
  };

  /** Mark the difference from touch start event when touch moves */
  private onTouchMoveHandler = (event: TouchEvent): void => {
    stopEventPropagation(event);

    const touchObj = event.changedTouches[0];

    this.currentTransformDiff = {
      x: touchObj.pageX - this.currentTransformStart.x,
      y: touchObj.pageY - this.currentTransformStart.y
    };

    this.panVideo();
  };

  /** Touch start event when touch event is detected */
  private onTouchStart = (event: TouchEvent): void => {
    stopEventPropagation(event);

    this.calculateAndSetMirrorCoordinates();

    const touchObj = event.changedTouches[0];

    this.currentTransformStart = {
      x: touchObj.pageX - this.currentTransformDiff.x,
      y: touchObj.pageY - this.currentTransformDiff.y
    };

    this.element.addEventListener('touchend', this.onTouchEnd, false);
    this.element.addEventListener('touchmove', this.onTouchMoveHandler, false);
  };

  /** Cleanup the listeners added on touch start */
  private onTouchEnd = (): void => {
    this.element.removeEventListener('touchend', this.onTouchEnd, false);
    this.element.removeEventListener('touchmove', this.onTouchMoveHandler, false);

    this.validatePositionAndPan();
  };

  /**
   * Based on the keyboard event trigger the relevant actions zoomIn, zoomOut, zoomReset, Pan
   * @param {KeyboardEvent}
   */
  private onKeyboardEvent = (event: KeyboardEvent): void => {
    const ctrlOrCmdPressed = event.metaKey || event.ctrlKey;
    const altPressed = event.altKey;

    if (ctrlOrCmdPressed && !altPressed) {
      let keyboardEventHandled = true;

      switch (event.key) {
        case '=':
        case '+':
          this.zoomThrottled(ZoomAction.In);
          break;

        case '-':
          this.zoomThrottled(ZoomAction.Out);
          break;

        case '0':
          this.zoomThrottled(ZoomAction.Reset);
          break;

        case 'ArrowUp':
          this.currentTransformDiff.y += DEFAULT_PAN_DISTANCE;
          this.panVideo();
          keyboardEventHandled = false;
          this.validatePositionAndPan();
          break;

        case 'ArrowDown':
          this.currentTransformDiff.y -= DEFAULT_PAN_DISTANCE;
          this.panVideo();
          keyboardEventHandled = false;
          this.validatePositionAndPan();
          break;

        case 'ArrowLeft':
          this.currentTransformDiff.x += DEFAULT_PAN_DISTANCE;
          this.panVideo();
          keyboardEventHandled = false;
          this.validatePositionAndPan();
          break;

        case 'ArrowRight':
          this.currentTransformDiff.x -= DEFAULT_PAN_DISTANCE;
          this.panVideo();
          keyboardEventHandled = false;
          this.validatePositionAndPan();
          break;

        default:
          keyboardEventHandled = false;
      }

      if (keyboardEventHandled) {
        stopEventPropagation(event);
      }
    }
  };

  /**
   * Based on the wheel event we set the correct initial positioning
   * If zooming in positioning should follow the mouse.
   * If zooming out positioning should follow a relation of existing positioning and size.
   */
  private setInitialCoordinatesBasedOnMouse(event: WheelEvent): void {
    const isScrollUp = event.deltaY < 0;

    if (isScrollUp) {
      // Use the parentElement's position as the this.element shifts based on zoom & transform
      const elementBoundingRect = this.element.parentElement?.getBoundingClientRect();
      this.currentTransformDiff = {
        x: event.pageX - (elementBoundingRect?.left ?? 0),
        y: event.pageY - (elementBoundingRect?.top ?? 0)
      };
    } else {
      const existingTransformations = getExistingTransformations(this.element);

      this.currentTransformDiff = {
        x: (existingTransformations.relativeX * this.element.clientWidth) / FULL_SIZE,
        y: (existingTransformations.relativeY * this.element.clientHeight) / FULL_SIZE
      };
    }
  }

  /** Mouse wheel event used to init zoom in/out actions */
  private onMouseWheel = (event: WheelEvent): void => {
    const ctrlOrCmdPressed = event.metaKey || event.ctrlKey;

    if (ctrlOrCmdPressed) {
      this.setInitialCoordinatesBasedOnMouse(event);

      this.shouldMirrorCoordinates = true;

      if (event.deltaY < 0) {
        // scroll up
        this.zoomThrottled(ZoomAction.In, true);
      } else if (event.deltaY > 0) {
        // scroll down
        this.zoomThrottled(ZoomAction.Out, true);
      }

      stopEventPropagation(event);
    }
  };

  private zoomThrottled(action: ZoomAction, shouldPanAroundMouse?: boolean): void {
    // TODO: THROTTLING
    return this.zoom(action, shouldPanAroundMouse);
  }

  /**
   * Sets the actual scalling and based on the action triggers the panning.
   * @param {boolean} shouldPanAroundMouse a boolean passed down to the actual panning function to decide about the mirroring or not coordinates.
   */
  private zoom(action: ZoomAction, shouldPanAroundMouse?: boolean): void {
    switch (action) {
      case ZoomAction.In:
        if (this.currentZoomLevel === ZOOM_LEVELS.length - 1) {
          return;
        }
        this.currentZoomLevel++;
        this.validatePositionAndPan(!!shouldPanAroundMouse);
        break;

      case ZoomAction.Out:
        if (this.currentZoomLevel === 0) {
          return;
        } else if (this.currentZoomLevel === 1) {
          this.resetZoomLevels();
        }
        this.currentZoomLevel--;
        this.validatePositionAndPan(!!shouldPanAroundMouse);
        break;

      case ZoomAction.Reset:
        this.currentZoomLevel = 0;
        this.resetZoomLevels();
        break;
    }
  }

  /**
   * Calculate and set the max available bounds for this move
   * @param {boolean} shouldPanAroundMouse used to decide if we mirror or real coordinates should be used
   */
  private validatePositionAndPan(shouldPanAroundMouse?: boolean): void {
    const relativeX = FULL_SIZE - (this.currentTransformDiff.x / this.element.clientWidth) * FULL_SIZE;
    const relativeY = FULL_SIZE - (this.currentTransformDiff.y / this.element.clientHeight) * FULL_SIZE;

    // Clamp values
    if (relativeY < 0) {
      this.currentTransformDiff.y = this.element.clientHeight;
    } else if (relativeY > FULL_SIZE) {
      this.currentTransformDiff.y = 0;
    }
    if (relativeX < 0) {
      this.currentTransformDiff.x = this.element.clientWidth;
    } else if (relativeX > FULL_SIZE) {
      this.currentTransformDiff.x = 0;
    }

    this.panVideo(!!shouldPanAroundMouse);
  }

  /**
   * Pan the element to the final coordinates
   * @param {boolean} shouldPanAroundMouse used to decide if we mirror or real coordinates should be used
   */
  private panVideo(shouldPanAroundMouse?: boolean): void {
    const relativeX = this.currentTransformDiff.x / this.element.clientWidth;
    const relativeY = this.currentTransformDiff.y / this.element.clientHeight;

    const transformation = {
      transformOriginX: shouldPanAroundMouse ? relativeX * FULL_SIZE : FULL_SIZE - relativeX * FULL_SIZE,
      transformOriginY: shouldPanAroundMouse ? relativeY * FULL_SIZE : FULL_SIZE - relativeY * FULL_SIZE,
      scale: ZOOM_LEVELS[this.currentZoomLevel] / FULL_SIZE
    };

    this.emitChange(transformation);
  }
}

const stopEventPropagation = (event: UIEvent): void => {
  event.stopImmediatePropagation();
  event.preventDefault();
};

const getExistingTransformations = (element: HTMLElement): RelativeTransformation => {
  const defaultRelative: RelativeTransformation = {
    relativeX: 0,
    relativeY: 0
  };

  const transformOriginValuesArray =
    element && element.style && element.style.transformOrigin
      ? element.style.transformOrigin.match(/(\d*\.\d*|[-.\d]{1,3})/g)
      : [];

  if (!transformOriginValuesArray || transformOriginValuesArray.length < MIN_EXISTING_TRANSFORMATION_STYLES) {
    return defaultRelative;
  }

  return {
    relativeX: parseFloat(transformOriginValuesArray[0]),
    relativeY: parseFloat(transformOriginValuesArray[1])
  };
};
