import { Box, Button, TextField } from '@mui/material';
import React, { Fragment, useRef } from 'react';
import { FileGrab } from 'src/types';

interface RectangleGrabber {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ImageCropperProps {
  image: File;
  imageGrabHandler: (data: FileGrab) => void
}

// TODO: Implement boundries for touch events
export const ImageGrabber = ({ image, imageGrabHandler }: ImageCropperProps): JSX.Element => {
  const isGrabbing = useRef(false);
  const rectElement = useRef<HTMLImageElement>();
  const rectPosition = useRef<RectangleGrabber>({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  });

  const grabStartHandler = (
    e: React.SyntheticEvent<HTMLImageElement>
  ): void => {
    isGrabbing.current = true;
    if (e.nativeEvent instanceof MouseEvent) {
      rectPosition.current.x = e.nativeEvent.clientX;
      rectPosition.current.y = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      rectPosition.current.x = e.nativeEvent.touches[0].clientX;
      rectPosition.current.y = e.nativeEvent.touches[0].clientY;
    }
  };

  const grabMoveHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    if (isGrabbing.current) {
      if (e.nativeEvent instanceof MouseEvent) {
        rectPosition.current.dx = e.nativeEvent.clientX;
        rectPosition.current.dy = e.nativeEvent.clientY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        rectPosition.current.dx = e.nativeEvent.touches[0].clientX;
        rectPosition.current.dy = e.nativeEvent.touches[0].clientY;
      }

      showRectangle();
    }
  };

  const grabEndHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    isGrabbing.current = false;
  };

  const showRectangle = (): void => {
    if (rectElement.current != null) {
      rectElement.current.style.display = 'block';
      rectElement.current.style.position = 'absolute';
      rectElement.current.style.left = `${rectPosition.current.x}px`;
      rectElement.current.style.top = `${rectPosition.current.y}px`;
      rectElement.current.style.width = `${
        rectPosition.current.dx - rectPosition.current.x
      }px`;
      rectElement.current.style.height = `${
        rectPosition.current.dy - rectPosition.current.y
      }px`;
    }
  };

  return (
    <Fragment>
      <TextField label='Name of Field' variant='outlined' />
      <Box
        ref={rectElement}
        sx={{
          border: 'solid 2px red',
          pointerEvents: 'none',
          display: 'none',
        }}
      ></Box>
      <Box
        component='img'
        alt='Statement File 1'
        src={URL.createObjectURL(image)}
        onMouseDown={grabStartHandler}
        onTouchStart={grabStartHandler}
        onMouseMove={grabMoveHandler}
        onTouchMove={grabMoveHandler}
        onMouseUp={grabEndHandler}
        onTouchEnd={grabEndHandler}
        draggable={false}
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          userSelect: 'none',
          border: 'solid 2px blue',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button variant='contained' onClick={() => imageGrabHandler()}>
          Set
        </Button>
        <Button variant='contained'>Finish</Button>
      </Box>
    </Fragment>
  );
};
