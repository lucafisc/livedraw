"use client";
import { useDraw } from "@/hooks/useDraw";
import * as React from "react";
import { Draw, Point, DrawLine, Tools } from "../types/types";
import { GithubPicker } from "react-color";
import { io } from "socket.io-client";
import { draw } from "../utils/draw";
import { useEffect } from "react";
import ImageButton from "@/components/ImageButton";
import FlexContainer from "@/components/FlexContainer";
import { config } from "@/utils/config";

const socket = io("https://livedrawserver.onrender.com");

export interface IAppProps {}

function Home(props: IAppProps) {
  const [lineColor, setLineColor] = React.useState<string>("#000");
  const [showColorPicker, setShowColorPicker] = React.useState<boolean>(false);
  const [tool, setTool] = React.useState<Tools>(Tools.PENCIL);
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    socket.emit("user-connected");
    socket.on("user-requested-canvas", () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      socket.emit("send-newest-canvas", canvas.toDataURL());
    });
    socket.on("receive-newest-canvas", (newestCanvas: string) => {
      if (newestCanvas === canvasRef.current?.toDataURL()) return;
      const img = document.createElement("img");
      img.src = newestCanvas;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, lineColor, tool }: DrawLine) => {
        draw({ prevPoint, currentPoint, ctx, lineColor, tool });
      }
    );
    socket.on("clear", clear);
    return () => {
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef]);
  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, lineColor, tool });
    draw({ prevPoint, currentPoint, ctx, lineColor, tool });
  }

  useEffect(() => {
    let cursorClass = "";
    switch (tool) {
      case Tools.PENCIL:
        cursorClass = "pencil-cursor";
        break;
      case Tools.SPRAY:
        cursorClass = "spray-cursor";
        break;
      case Tools.BRUSH:
        cursorClass = "brush-cursor";
        break;
      default:
        cursorClass = "pencil-cursor";
        break;
    }
    document.body.className = cursorClass;
  }, [tool]);

  return (
    <div className="w-screen h-screen bg-blue-200 flex justify-between items-center flex-col gap-2">
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
      <div
        className="relative"
        style={{
          backgroundImage: `url(/images/canvas.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: 547,
          height: 446,
        }}
      >
        <canvas
          onMouseDown={onMouseDown}
          ref={canvasRef}
          width={547}
          height={446}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      <FlexContainer>
        <h2 className="text-xl font-karrik ">i</h2>
        <a href="https://github.com/lucafisc">
          <h2 className="text-xl font-karrik hover:text-yellow-100">
            github.com/lucafisc
          </h2>
        </a>
      </FlexContainer>
    </div>
  );
}

export default Home;
