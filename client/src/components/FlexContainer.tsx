import React, { ReactNode } from 'react';

interface FlexContainerProps {
  children: ReactNode;
}

const FlexContainer: React.FC<FlexContainerProps> = ({ children }) => {
  return (
    <div className="flex max-w-screen-lg w-full p-4 mx-auto justify-between items-center text-black">
      {children}
    </div>
  );
};

export default FlexContainer;
