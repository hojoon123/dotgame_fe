"use client";
import GameCanvas from "@/components/game/GameCanvas";
import MiniMap from "@/components/game/MiniMap";
import { useRef, useState } from "react";

export default function GamePage(){
  const [sessionId, setSessionId] = useState(0);
  const [connected, setConnected] = useState(false);

  const [stage, setStage] = useState(1);
  const [time, setTime] = useState(0);
  const [balls, setBalls] = useState<any[]>([]);
  const [enemies, setEnemies] = useState<any[]>([]);
  const [upgrades, setUpgrades] = useState<Record<string,number>>({});
  const [effects, setEffects] = useState<any[]>([]);

  const [log, setLog] = useState("");
  const socketRef= useRef<WebSocket|null>(null);

  // 유닛 선택
  const [selectedUnit, setSelectedUnit] = useState<{type:'ball'|'enemy',index:number}|null>(null);

  const connectWS=(sid:number)=>{
    if(socketRef.current){
      socketRef.current.close();
      socketRef.current=null;
    }
    const wsUrl=`ws://127.0.0.1:8000/ws/game/${sid}/`;
    const ws= new WebSocket(wsUrl);

    ws.onopen=()=>{
      setLog(prev=>prev+`[MSG] 소켓 연결 => session=${sid}\n`);
      setConnected(true);
    };
    ws.onmessage=(evt)=>{
      const data= JSON.parse(evt.data);
      if(data.kind==="tick_update"){
        setStage(data.stage);
        setTime(data.time_in_stage);
        setEnemies(data.enemies);
        setBalls(data.balls);
        setUpgrades(data.upgrades);
        setEffects(data.effects||[]);
      } else if(data.message){
        setLog(prev=>prev+`[MSG] ${data.message}\n`);
      } else {
        setLog(prev=>prev+`[WS] ${JSON.stringify(data)}\n`);
      }
    };
    ws.onclose=()=>{
      setLog(prev=>prev+`[MSG] 소켓 종료 => session=${sid}\n`);
      setConnected(false);
    };
    socketRef.current= ws;
  };

  const handleStartSession=()=>{
    const newId= sessionId+1;
    setSessionId(newId);
    connectWS(newId);
  };
  const handleEndSession=()=>{
    if(!socketRef.current)return;
    socketRef.current.send(JSON.stringify({action:'end_game'}));
  };

  const handleSummonBall=()=>{
    if(!socketRef.current)return;
    socketRef.current.send(JSON.stringify({action:'summon_ball'}));
  };
  const handleUpgradeColor=(col:string)=>{
    if(!socketRef.current)return;
    socketRef.current.send(JSON.stringify({action:'upgrade_color', color:col}));
  };

  // 우클릭 => 이동
  const handleRightClickEmpty=(mx:number,my:number)=>{
    if(!socketRef.current)return;
    if(!selectedUnit) return;
    if(selectedUnit.type==='ball'){
      // 디버그
      console.log("[page.tsx] move_ball => idx=",selectedUnit.index,"pos=",mx,my);
      socketRef.current.send(JSON.stringify({
        action:'move_ball',
        ball_idx: selectedUnit.index,
        tx: mx, ty: my
      }));
    }
  };

  // 유닛 선택 => HUD
  const handleSelectUnit=(u:{type:'ball'|'enemy', index:number}|null)=>{
    setSelectedUnit(u);
  };

  return (
    <div style={{position:"relative", width:"100vw", height:"100vh", background:"#000"}}>
      {/* 로그 상단 */}
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"80%", height:100, overflowY:"auto",
        background:"rgba(0,0,0,0.8)", color:"#fff"
      }}>
        <pre style={{margin:5}}>{log}</pre>
      </div>

      {/* 세션 제어 (좌상단) */}
      <div style={{position:"absolute", left:10, top:110, color:"#fff"}}>
        <button onClick={handleStartSession}>세션 시작</button>
        <button onClick={handleEndSession} style={{marginLeft:5}}>세션 종료</button>
        <p>세션ID: {sessionId}, 연결: {connected?"연결됨":"끊김"}</p>
        <p>Stage: {stage} / Time: {time.toFixed(1)}</p>
      </div>

      {/* 미니맵 좌하단 */}
      <div style={{position:"absolute", left:10, bottom:10}}>
        <MiniMap
          balls={balls}
          enemies={enemies}
          mapWidth={400} mapHeight={400}
          width={80} height={80}
        />
      </div>

      {/* 캔버스 중앙 */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        transform:"translate(-50%,-50%)"
      }}>
        <GameCanvas
          width={400} height={400}
          balls={balls}
          enemies={enemies}
          effects={effects}
          onSelectUnit={handleSelectUnit}
          onRightClickEmpty={handleRightClickEmpty}
        />
      </div>

      {/* HUD (우하단) */}
      <div style={{
        position:"absolute", right:10, bottom:10,
        width:220, height:270,
        background:"rgba(0,0,0,0.7)", color:"#fff", padding:10
      }}>
        <h3>HUD</h3>
        {selectedUnit?
          (selectedUnit.type==='ball'?
            <div>
              <p>볼 #{selectedUnit.index}</p>
              <p>color={balls[selectedUnit.index].color}</p>
              <p>rarity={balls[selectedUnit.index].rarity}</p>
              <p>dmg={balls[selectedUnit.index].damage}</p>
              <p>cd={balls[selectedUnit.index].cooldown}</p>
            </div>
           :
            <div>
              <p>적 #{selectedUnit.index}</p>
              <p>name={enemies[selectedUnit.index].name}</p>
              <p>hp={enemies[selectedUnit.index].hp}</p>
              <p>def={enemies[selectedUnit.index].defense}</p>
              <p>shield={enemies[selectedUnit.index].shield}</p>
            </div>
          )
          : <p>선택된 유닛 없음</p>
        }

        <h4>볼 소환</h4>
        <button onClick={handleSummonBall}>소환</button>

        <h4>업그레이드</h4>
        {["red","orange","yellow","green","blue","navy","purple"].map(c=>
          <button key={c} onClick={()=>handleUpgradeColor(c)} style={{margin:2}}>{c}</button>
        )}
      </div>
    </div>
  );
}
