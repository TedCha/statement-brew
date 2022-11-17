import React, { useRef } from 'react';
import { ApplicationError, useApplicationError } from '../../context';
import { ImageGrab } from 'src/interfaces';
import { Button } from '../Button';

interface Coordinate {
  x: number;
  y: number;
}

interface RectangleGrabber {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ImageGrabberProps {
  image: File;
  isLastFile: boolean;
  imageGrabHandler: (data?: ImageGrab) => void;
  finishGrabsHandler: () => void;
}

// TODO v2: Implement translation of grab on window resize
export const ImageGrabber = ({
  image,
  isLastFile,
  imageGrabHandler,
  finishGrabsHandler,
}: ImageGrabberProps): JSX.Element => {
  const setApplicationError = useApplicationError();
  const grabElement = useRef<HTMLDivElement>(null);
  const imgElement = useRef<HTMLImageElement>(null);
  const isGrabbing = useRef(false);
  const grabPosition = useRef<RectangleGrabber>({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  });

  const hasGrabPositionChanged = (): boolean => {
    return !(
      grabPosition.current.x === 0 &&
      grabPosition.current.y === 0 &&
      grabPosition.current.dx === 0 &&
      grabPosition.current.dy === 0
    );
  };

  const captureHandler = (): void => {
    try {
      if (!hasGrabPositionChanged()) {
        throw new ApplicationError('handled', 'No new data to capture');
      }

      if (imgElement.current == null || grabElement.current == null) {
        throw new ApplicationError('fatal', 'Internal application error');
      }

      const imgRect = imgElement.current?.getBoundingClientRect();
      const grabRect = grabElement.current?.getBoundingClientRect();

      // Since we want to use the high resolution base image for OCR processing
      // but a smaller scale of the image when rendering in HTML, we need to calculate
      // multipliers in order to scale the grab to the base image size
      const widthMultiplier = imgElement.current.naturalWidth / imgRect.width;
      const heightMultiplier =
        imgElement.current.naturalHeight / imgRect.height;

      imageGrabHandler({
        left: (grabRect.left - imgRect.left) * widthMultiplier,
        top: (grabRect.top - imgRect.top) * heightMultiplier,
        width: grabRect.width * widthMultiplier,
        height: grabRect.height * heightMultiplier,
      });
    } catch (e) {
      if (e instanceof ApplicationError) {
        setApplicationError(e);
      } else {
        setApplicationError(
          new ApplicationError('fatal', 'Internal application error')
        );
      }
    } finally {
      // Reset the grab element
      grabElement.current?.classList?.add('hidden');
      grabPosition.current = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
      };
    }
  };

  const getClientPosition = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): Coordinate => {
    const position: Coordinate = { x: 0, y: 0 };
    if (e.nativeEvent instanceof MouseEvent) {
      position.x = e.nativeEvent.clientX;
      position.y = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      position.x = e.nativeEvent.touches[0].clientX;
      position.y = e.nativeEvent.touches[0].clientY;
    }
    return position;
  };

  const grabStartHandler = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    const { x, y } = getClientPosition(e);
    isGrabbing.current = true;
    grabPosition.current.x = x;
    grabPosition.current.y = y;
  };

  const grabMoveHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const { x, y } = getClientPosition(e);
    if (isGrabbing.current) {
      grabPosition.current.dx = x;
      grabPosition.current.dy = y;

      showGrab();
    }
  };

  const grabEndHandler = (): void => {
    isGrabbing.current = false;
  };

  const showGrab = (): void => {
    if (grabElement.current != null) {
      grabElement.current.classList.remove('hidden');
      grabElement.current.classList.add('block');

      Object.assign(grabElement.current.style, {
        left: `${grabPosition.current.x}px`,
        top: `${grabPosition.current.y}px`,
        width: `${grabPosition.current.dx - grabPosition.current.x}px`,
        height: `${grabPosition.current.dy - grabPosition.current.y}px`,
      });
    }
  };

  // TODO v2: Make all images the same size with white padding around
  return (
    <div className='flex flex-col'>
      <div
        className='border-solid border-2 border-rose-500 pointer-events-none absolute hidden'
        ref={grabElement}
      ></div>
      <div className='py-4 max-w-full max-h-full '>
        <img
          className='select-none touch-none shadow-lg'
          alt='Uploaded File'
          src={URL.createObjectURL(image)}
          onMouseDown={grabStartHandler}
          onTouchStart={grabStartHandler}
          onMouseMove={grabMoveHandler}
          onTouchMove={grabMoveHandler}
          onMouseUp={grabEndHandler}
          onTouchEnd={grabEndHandler}
          draggable={false}
          ref={imgElement}
        />
      </div>
      <div className='flex justify-end gap-3'>
        <Button onClick={captureHandler}>Capture</Button>
        <Button onClick={finishGrabsHandler}>
          {isLastFile ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
