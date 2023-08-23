import React from 'react';
import Image from "next/image"


interface ImageButtonProps {
  src: string;
  alt: string;
}

const ImageButton: React.FC<ImageButtonProps> = ({ src, alt }) => {
  return (
    <button className="">
      <Image src={src} alt={alt} width={50} height={50} />
    </button>
  );
};

export default ImageButton;
