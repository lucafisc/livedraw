"use client";
import { useDraw } from "@/hooks/useDraw";
import * as React from "react";
import { Draw, Point, DrawLine } from "../types/types";
import { GithubPicker } from "react-color";
import { io } from "socket.io-client";
import { drawLine } from "../utils/drawLine";
import { useEffect } from "react";
import ImageButton from "@/components/ImageButton";
import FlexContainer from "@/components/FlexContainer";

const socket = io("http://localhost:3001");

export interface IAppProps {}

function Home(props: IAppProps) {
  const [lineColor, setLineColor] = React.useState<string>("#000");
  const [showColorPicker, setShowColorPicker] = React.useState<boolean>(false);
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
      ({ prevPoint, currentPoint, lineColor }: DrawLine) => {
        drawLine({ prevPoint, currentPoint, ctx, lineColor });
      }
    );
    socket.on("clear", clear);
    return () => {
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef]);
  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, lineColor });
    drawLine({ prevPoint, currentPoint, ctx, lineColor });
  }

  return (
    <div className="w-screen h-screen bg-blue-200 flex justify-center items-center flex-col gap-2">
      <FlexContainer>
        <h1 className="text-4xl font-karrik">live draw</h1>
        <div className="flex items-center justify-center relative">
          <ImageButton src="/images/pencil.svg" alt="pencil" />
          <ImageButton src="/images/spray.svg" alt="spray" />
          <button
            className="  flex justify-center items-center "
            style={{ width: 50, height: 50 }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div
              className="border-2 border-black "
              style={{ width: 30, height: 20, backgroundColor: lineColor }}
            ></div>
            {showColorPicker && (
              <div className="absolute top-12 right-14 z-10">
                <GithubPicker
                  color={lineColor}
                  onChange={(e) => setLineColor(e.hex)}
                  triangle={"top-right"}
                  width={"212px"}
                  colors={[
                    "#FFA3FF",
                    "#A3FFFF",
                    "#FFFFA3",
                    "#FFA3A3",
                    "#A3FFA3",
                    "#A3A3FF",
                    "#FFCBA3",
                    "#FFFFFF",
                    "#FF00FF",
                    "#00FFFF",
                    "#FFFF00",
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FF9900",
                    "#000000",
                  ]}
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
        <h2 className="text-xl font-karrik">i</h2>
        <a href="github.com/lucafisc">
          <h2 className="text-xl font-karrik">github.com/lucafisc</h2>
        </a>
      </FlexContainer>
    </div>
  );
}

export default Home;
