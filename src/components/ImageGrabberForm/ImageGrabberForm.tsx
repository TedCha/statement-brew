import { Box, Button, TextField } from '@mui/material';
import React, { useRef } from 'react';
import { ImageGrab } from 'src/interfaces';

interface RectangleGrabber {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ImageGrabberProps {
  image: File;
  imageGrabHandler: (data?: ImageGrab) => void;
}

// TODO: Implement boundries for touch events
// TODO: Implement translation of grab on window resize
export const ImageGrabberForm = ({
  image,
  imageGrabHandler,
}: ImageGrabberProps): JSX.Element => {
  const fieldNameInputElement = useRef<HTMLInputElement>();
  const grabElement = useRef<HTMLDivElement>();
  const imgElement = useRef<HTMLImageElement>();
  const isGrabbing = useRef(false);
  const grabPosition = useRef<RectangleGrabber>({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (
      imgElement.current == null ||
      grabElement.current == null ||
      fieldNameInputElement.current?.value == null
    ) {
      // TODO: Error Handling
      console.error('one or more references are null');
      return;
    }

    const imgRect = imgElement.current?.getBoundingClientRect();
    const grabRect = grabElement.current?.getBoundingClientRect();

    // Since we want to use the high resolution base image for OCR processing
    // but scale the image down when rendering, we need to calculate multipliers
    // in order to scale the grab to the base image size
    const widthMultiplier = imgElement.current.naturalWidth / imgRect.width;
    const heightMultiplier = imgElement.current.naturalHeight / imgRect.height;

    imageGrabHandler({
      name: fieldNameInputElement.current.value,
      left: (grabRect.left - imgRect.left) * widthMultiplier,
      top: (grabRect.top - imgRect.top) * heightMultiplier,
      width: grabRect.width * widthMultiplier,
      height: grabRect.height * heightMultiplier,
    });

    // Reset the form
    if (e.target instanceof HTMLFormElement && grabElement.current != null) {
      e.target.reset();
      grabElement.current.style.display = 'none';
    } else {
      // TODO: Error Handling
      console.error('failed to reset form');
    }
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

  const grabEndHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    isGrabbing.current = false;
  };

  const showGrab = (): void => {
    if (grabElement.current != null) {
      grabElement.current.style.display = 'block';
      grabElement.current.style.position = 'absolute';
      grabElement.current.style.left = `${grabPosition.current.x}px`;
      grabElement.current.style.top = `${grabPosition.current.y}px`;
      grabElement.current.style.width = `${
        grabPosition.current.dx - grabPosition.current.x
      }px`;
      grabElement.current.style.height = `${
        grabPosition.current.dy - grabPosition.current.y
      }px`;
    }
  };

  return (
    <Box
      component='form'
      onSubmit={submitHandler}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextField
        label='Field Name'
        variant='outlined'
        required
        inputRef={fieldNameInputElement}
      />
      <Box
        ref={grabElement}
        sx={{
          border: 'solid 1px red',
          pointerEvents: 'none',
          display: 'none',
        }}
      ></Box>
      <Box
        component='img'
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
        <Button variant='contained' type='submit'>
          Set
        </Button>
      </Box>
    </Box>
  );
};
