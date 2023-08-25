import FlexContainer from "./FlexContainer";
import ImageButton from "./ImageButton";
import { Tools } from "../types/types";
import React from 'react';
import { GithubPicker } from "react-color";
import { config } from "../utils/config";

interface HeaderProps {
	setLineColor: (color: string) => void;
	setShowColorPicker: (show: boolean) => void;
	showColorPicker: boolean;
	lineColor: string;
	setTool: (tool: Tools) => void;
	socket: any;
}

const Header: React.FC<HeaderProps> = ({ setLineColor, setShowColorPicker, showColorPicker, lineColor, setTool, socket }) => {
  return (
    <FlexContainer>
      <h1 className="text-4xl font-karrik">live draw</h1>
      <div className="flex items-center justify-center relative">
        <ImageButton
          src="/images/pencil.svg"
          alt="pencil"
          onClick={() => setTool(Tools.PENCIL)}
        />
        <ImageButton
          src="/images/brush.svg"
          alt="brush"
          onClick={() => setTool(Tools.BRUSH)}
        />
        <ImageButton
          src="/images/spray.svg"
          alt="spray"
          onClick={() => setTool(Tools.SPRAY)}
        />
        <button
          className="  flex justify-center items-center "
          style={{ width: 50, height: 50 }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <div
            className="border-2 border-black transition-transform transform active:scale-95 hover:scale-105"
            style={{ width: 30, height: 20, backgroundColor: lineColor }}
          ></div>
          {showColorPicker && (
            <div className="absolute top-12 right-14 z-10" id="picker">
              <GithubPicker
                color={lineColor}
                onChange={(e) => setLineColor(e.hex)}
                triangle={"top-right"}
                width={"212px"}
                colors={config.colorPalette}
              />
            </div>
          )}
        </button>
        <ImageButton
          src="/images/eraser.svg"
          alt="eraser"
          onClick={() => socket.emit("clear")}
        />
      </div>
    </FlexContainer>
  );
};

export default Header;
