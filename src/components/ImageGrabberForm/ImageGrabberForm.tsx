import { Box, Button, TextField } from '@mui/material';
import React, { useRef } from 'react';
import { ImageGrab } from 'src/interfaces';

interface RectangleGrabber {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface ImageCropperProps {
  image: File;
  imageGrabHandler: (data?: ImageGrab) => void;
}

// TODO: Implement boundries for touch events
export const ImageGrabberForm = ({
  image,
  imageGrabHandler,
}: ImageCropperProps): JSX.Element => {
  const isGrabbing = useRef(false);
  const fieldNameInputElement = useRef<HTMLInputElement>();
  const grabElement = useRef<HTMLDivElement>();
  const imgElement = useRef<HTMLImageElement>();
  const grabPosition = useRef<RectangleGrabber>({
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const imgRect = imgElement.current?.getBoundingClientRect();
    const grabRect = grabElement.current?.getBoundingClientRect();

    if (
      imgRect == null ||
      grabRect == null ||
      fieldNameInputElement.current?.value == null
    ) {
      imageGrabHandler();
    } else {
      imageGrabHandler({
        [fieldNameInputElement.current.value]: {
          left: grabRect.left - imgRect.left,
          top: grabRect.top - imgRect.top,
          width: grabRect.width,
          height: grabRect.height,
        },
      });
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

      showRectangle();
    }
  };

  const grabEndHandler = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    isGrabbing.current = false;
  };

  const showRectangle = (): void => {
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
          border: 'solid 2px red',
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
