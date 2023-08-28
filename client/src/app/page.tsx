"use client";
import { useDraw } from "@/hooks/useDraw";
import * as React from "react";
import { Draw, DrawLine, Tools } from "../types/types";
import { io } from "socket.io-client";
import { draw } from "../utils/draw";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface IAppProps {}

function Home(props: IAppProps) {
  const [lineColor, setLineColor] = React.useState<string>("#000");
  const [showColorPicker, setShowColorPicker] = React.useState<boolean>(false);
  const [tool, setTool] = React.useState<Tools>(Tools.PENCIL);
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
    const [socket, setSocket] = React.useState<any>(io("https://livedrawserver.onrender.com"))
 // const [socket, setSocket] = React.useState<any>(io("http://localhost:3001"));

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
      socket.off("user-requested-canvas");
      socket.off("receive-newest-canvas");
      socket.off("user-connected");
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
      <Header
        setLineColor={setLineColor}
        setShowColorPicker={setShowColorPicker}
        showColorPicker={showColorPicker}
        lineColor={lineColor}
        setTool={setTool}
        socket={socket}
      />
      <div
        className="relative w-full"
        style={{
          backgroundImage: `url(/images/canvas.svg)`,
          backgroundSize: "cover",
			backgroundPosition: "center",
			width: 547,
			height: 446
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
      <Footer />
    </div>
  );
}

export default Home;
