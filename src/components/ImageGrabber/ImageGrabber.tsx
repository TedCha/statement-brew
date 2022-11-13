import React, { useRef } from 'react';
import { ImageGrab } from 'src/interfaces';
import { Button } from '../Button';

interface RectangleGrabber {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ImageGrabberProps {
  image: File;
  imageGrabHandler: (data?: ImageGrab) => void;
  finishGrabsHandler: () => void;
}

// TODO: Implement boundries for touch events
// TODO: Implement translation of grab on window resize
export const ImageGrabber = ({
  image,
  imageGrabHandler,
  finishGrabsHandler,
}: ImageGrabberProps): JSX.Element => {
  const grabElement = useRef<HTMLDivElement>(null);
  const imgElement = useRef<HTMLImageElement>(null);
  const isGrabbing = useRef(false);
  const grabPosition = useRef<RectangleGrabber>({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  });

  const captureHandler = (): void => {
    if (imgElement.current == null || grabElement.current == null) {
      // TODO: Error Handling
      console.error('one or more references are null');
      return;
    }

    const imgRect = imgElement.current?.getBoundingClientRect();
    const grabRect = grabElement.current?.getBoundingClientRect();

    // Since we want to use the high resolution base image for OCR processing
    // but a smaller scale of the image when rendering in HTML, we need to calculate
    // multipliers in order to scale the grab to the base image size
    const widthMultiplier = imgElement.current.naturalWidth / imgRect.width;
    const heightMultiplier = imgElement.current.naturalHeight / imgRect.height;

    imageGrabHandler({
      left: (grabRect.left - imgRect.left) * widthMultiplier,
      top: (grabRect.top - imgRect.top) * heightMultiplier,
      width: grabRect.width * widthMultiplier,
      height: grabRect.height * heightMultiplier,
    });

    // Reset the grab element
    grabElement.current.classList.add('hidden');
  };

  const grabStartHandler = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    isGrabbing.current = true;
    if (e.nativeEvent instanceof MouseEvent) {
      grabPosition.current.x = e.nativeEvent.clientX;
      grabPosition.current.y = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      grabPosition.current.x = e.nativeEvent.touches[0].clientX;
      grabPosition.current.y = e.nativeEvent.touches[0].clientY;
    }
  };

  const grabMoveHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    if (isGrabbing.current) {
      if (e.nativeEvent instanceof MouseEvent) {
        grabPosition.current.dx = e.nativeEvent.clientX;
        grabPosition.current.dy = e.nativeEvent.clientY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        grabPosition.current.dx = e.nativeEvent.touches[0].clientX;
        grabPosition.current.dy = e.nativeEvent.touches[0].clientY;
      }

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

  return (
    <div className='flex flex-col'>
      <div
        className='border-solid border-2 border-rose-500 pointer-events-none absolute hidden'
        ref={grabElement}
      ></div>
      <div className='py-4'>
        <img
          className='max-w-full max-h-full select-none shadow-lg'
          alt='Statement File' // TODO: Index statement file img alt
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
        <Button onClick={finishGrabsHandler}>Finish</Button>
      </div>
    </div>
  );
};
