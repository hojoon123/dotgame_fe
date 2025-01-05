"use client";
import { useEffect, useRef } from "react";

interface Ball{ x:number; y:number; color:string; }
interface Enemy{ x:number; y:number; is_dead?:boolean; }

interface Props{
  balls:Ball[];
  enemies:Enemy[];
  mapWidth?: number;
  mapHeight?: number;
  width?: number;
  height?: number;
}

export default function MiniMap({
  balls, enemies,
  mapWidth=400, mapHeight=400,
  width=80, height=80
}:Props){
  const canvasRef= useRef<HTMLCanvasElement|null>(null);

  useEffect(()=>{
    const c= canvasRef.current;
    if(!c)return;
    const ctx= c.getContext("2d");
    if(!ctx)return;

    ctx.clearRect(0,0,width,height);
    ctx.fillStyle="#111";
    ctx.fillRect(0,0,width,height);

    const sx= width/mapWidth;
    const sy= height/mapHeight;

    // 적
    enemies.forEach(e=>{
      const mx= e.x*sx; const my= e.y*sy;
      ctx.fillStyle= e.is_dead?"gray":"red";
      ctx.beginPath();
      ctx.arc(mx,my,2,0,2*Math.PI);
      ctx.fill();
    });

    // 볼
    balls.forEach(b=>{
      let col= (b.color==="red")?"rgba(255,0,0,0.8)":"cyan";
      const mx= b.x*sx; const my= b.y*sy;
      ctx.fillStyle= col;
      ctx.beginPath();
      ctx.arc(mx,my,2,0,2*Math.PI);
      ctx.fill();
    });
  },[balls,enemies]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{border:"1px solid #222"}}
    />
  );
}
