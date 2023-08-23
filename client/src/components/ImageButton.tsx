import React from 'react';
import Image from "next/image"


interface ImageButtonProps {
  src: string;
	alt: string;
	onClick?: () => void;
}

const ImageButton: React.FC<ImageButtonProps> = ({ src, alt, onClick }) => {
  return (
    <button className="" onClick={onClick}>
      <Image src={src} alt={alt} width={50} height={50} className=" transition-transform transform active:scale-95 hover:scale-105"/>
    </button>
  );
};

export default ImageButton;
