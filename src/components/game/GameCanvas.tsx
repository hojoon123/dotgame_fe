"use client";

import React, { useEffect, useRef } from "react";

interface Ball{
  x:number; y:number; color:string;
  rarity?:string; damage?:number; cooldown?:number;
}
interface Enemy{
  x:number; y:number; name:string; hp:number;
  shield?:number; defense?:number; is_dead?:boolean;
}
interface AttackEffect{
  x1:number; y1:number; x2:number; y2:number; timer:number;
}

interface Props{
  width?: number;
  height?: number;
  balls: Ball[];
  enemies: Enemy[];
  effects: AttackEffect[];
  // 좌클릭 => 유닛 선택
  onSelectUnit?: (u:{type:'ball'|'enemy', index:number}|null)=>void;
  // 우클릭 => 볼 이동
  onRightClickEmpty?: (mx:number,my:number)=>void;
}

export default function GameCanvas({
  width=400, height=400,
  balls,enemies,effects,
  onSelectUnit,
  onRightClickEmpty
}:Props){

  const canvasRef= useRef<HTMLCanvasElement|null>(null);

  useEffect(()=>{
    const canvas= canvasRef.current;
    if(!canvas)return;
    const ctx= canvas.getContext("2d");
    if(!ctx)return;

    // 배경
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle="#444";
    ctx.fillRect(0,0,width,height);

    // 큰 사각형
    ctx.strokeStyle="#666";
    ctx.strokeRect(0,0,400,400);

    // 작은 사각형
    ctx.strokeRect(100,100,200,200);

    // 4개 구멍 (노란 점)
    ctx.strokeStyle="yellow";
    [[200,100],[200,300],[100,200],[300,200]].forEach(([gx,gy])=>{
      ctx.beginPath();
      ctx.arc(gx,gy,5,0,2*Math.PI);
      ctx.stroke();
    });

    // 적
    enemies.forEach((e,i)=>{
      const color= e.is_dead?"gray":"red";
      ctx.fillStyle= color;
      ctx.beginPath();
      ctx.arc(e.x,e.y,10,0,2*Math.PI);
      ctx.fill();
      // HP 표시
      ctx.fillStyle="white";
      ctx.font="10px sans-serif";
      ctx.fillText(`HP:${e.hp}`, e.x-20,e.y-15);
    });

    // 볼
    balls.forEach((b,i)=>{
      let c="cyan";
      if(b.color==="red") c="rgba(255,0,0,0.7)";
      else if(b.color==="blue") c="rgba(0,0,255,0.7)";
      else if(b.color==="purple") c="rgba(128,0,128,0.7)";

      ctx.fillStyle=c;
      ctx.beginPath();
      ctx.arc(b.x,b.y,8,0,2*Math.PI);
      ctx.fill();

      // 등급 표시
      ctx.fillStyle="white";
      ctx.fillText(`${b.rarity||""}`, b.x-10,b.y-10);
    });

    // 공격 이펙트 (노란 라인)
    ctx.strokeStyle="yellow";
    effects.forEach((fx)=>{
      ctx.beginPath();
      ctx.moveTo(fx.x1, fx.y1);
      ctx.lineTo(fx.x2, fx.y2);
      ctx.stroke();
    });

  },[balls,enemies,effects]);

  // 우클릭 => 이동
  const handleContextMenu=(e:React.MouseEvent<HTMLCanvasElement>)=>{
    e.preventDefault(); 
    if(!onRightClickEmpty)return;
    const rect= e.currentTarget.getBoundingClientRect();
    const mx= e.clientX- rect.left;
    const my= e.clientY- rect.top;

    // 디버그용
    console.log("[GameCanvas] RightClick =>", mx,my);

    onRightClickEmpty(mx,my);
  };

  // 좌클릭 => 유닛 선택
  const handleClick=(e:React.MouseEvent<HTMLCanvasElement>)=>{
    if(!onSelectUnit)return;
    const rect= e.currentTarget.getBoundingClientRect();
    const mx= e.clientX- rect.left;
    const my= e.clientY- rect.top;

    // 디버그
    console.log("[GameCanvas] LeftClick =>", mx,my);

    // 볼 검색
    let nearestBall=-1; let bDist=999999;
    balls.forEach((b,i)=>{
      const dx=b.x-mx; const dy=b.y-my;
      const dist= Math.sqrt(dx*dx+dy*dy);
      if(dist<10 && dist< bDist){
        bDist= dist; nearestBall=i;
      }
    });
    // 적 검색
    let nearestEnemy=-1; let eDist=999999;
    enemies.forEach((en,i)=>{
      const dx=en.x-mx; const dy=en.y-my;
      const dist= Math.sqrt(dx*dx+ dy*dy);
      if(dist<10 && dist< eDist){
        eDist= dist; nearestEnemy= i;
      }
    });

    if(nearestBall>=0 && (bDist< eDist || nearestEnemy<0)){
      onSelectUnit({type:'ball', index:nearestBall});
    } else if(nearestEnemy>=0){
      onSelectUnit({type:'enemy', index:nearestEnemy});
    } else {
      onSelectUnit(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{border:"1px solid #555"}}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    />
  );
}
