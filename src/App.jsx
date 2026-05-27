import { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard, Calendar, Map, Wrench, Users, ClipboardList,
  FileText, BarChart2, Bell, Settings, ChevronDown, ChevronLeft,
  ChevronRight, Search, Plus, RefreshCw, Check, Navigation,
  Share2, MoreVertical, MapPin, Activity, X, Menu, Trash2,
  Eye, Edit2, Download, Upload, Filter, AlertCircle, CheckCircle,
  Clock, TrendingUp, Phone, Mail, Star, LogOut, User, Shield,
  Save, ToggleLeft, ToggleRight, ChevronUp, Layers, Send
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Tooltip, CartesianGrid, Legend
} from "recharts";

// ─── BREAKPOINTS ──────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    if (w < 480) return "xs"; if (w < 768) return "sm";
    if (w < 1024) return "md"; return "lg";
  });
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) setBp("xs"); else if (w < 768) setBp("sm");
      else if (w < 1024) setBp("md"); else setBp("lg");
    };
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return bp;
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#f1f5f9",surface:"#fff",border:"#e2e8f0",
  dark:"#1e293b",mid:"#334155",muted:"#64748b",faint:"#94a3b8",
  blue:"#2563eb",blueLt:"#dbeafe",blueXlt:"#eff6ff",
  green:"#22c55e",greenDk:"#16a34a",greenLt:"#dcfce7",
  amber:"#f59e0b",amberLt:"#fef3c7",
  red:"#ef4444",redLt:"#fee2e2",
  purple:"#a855f7",purpleLt:"#f3e8ff",
  sidebar:"#1e293b",sidebarLine:"#334155",
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const INIT = {
  notifications: [
    {id:1,type:"success",title:"Installation completed",body:"Mike finished job #1-1005 at Johnson Residence",time:"10 min ago",read:false},
    {id:2,type:"info",title:"New purchase order",body:"PO-1006 uploaded for Williams Home",time:"25 min ago",read:false},
    {id:3,type:"warning",title:"Route R-21 delay",body:"Traffic on I-77 — estimated +25 min",time:"45 min ago",read:false},
    {id:4,type:"success",title:"Inspection submitted",body:"Anna Davis completed monthly inspection",time:"1 hr ago",read:true},
    {id:5,type:"error",title:"Job delayed",body:"Smith Commercial rescheduled to tomorrow",time:"2 hrs ago",read:true},
    {id:6,type:"info",title:"New technician added",body:"Robert Brown assigned to West zone",time:"3 hrs ago",read:true},
    {id:7,type:"warning",title:"Vehicle check due",body:"Truck #4 overdue for maintenance",time:"Yesterday",read:true},
    {id:8,type:"info",title:"Weekly report ready",body:"Week 20 performance summary available",time:"Yesterday",read:true},
  ],
  employees: [
    {id:1,name:"John Smith",role:"Lead Technician",zone:"Southwest",phone:"(704)555-0101",email:"john@blindambitions.com",installs:42,status:"active",avatar:"JS",color:"#3b82f6"},
    {id:2,name:"Mike Johnson",role:"Technician",zone:"East",phone:"(704)555-0102",email:"mike@blindambitions.com",installs:38,status:"active",avatar:"MJ",color:"#22c55e"},
    {id:3,name:"Anna Davis",role:"Inspector",zone:"North",phone:"(704)555-0103",email:"anna@blindambitions.com",installs:34,status:"active",avatar:"AD",color:"#f59e0b"},
    {id:4,name:"Robert Brown",role:"Technician",zone:"West",phone:"(704)555-0104",email:"robert@blindambitions.com",installs:40,status:"active",avatar:"RB",color:"#a855f7"},
    {id:5,name:"Sarah Lee",role:"Dispatcher",zone:"All",phone:"(704)555-0105",email:"sarah@blindambitions.com",installs:0,status:"active",avatar:"SL",color:"#06b6d4"},
    {id:6,name:"Tom Garcia",role:"Trainee",zone:"Southwest",phone:"(704)555-0106",email:"tom@blindambitions.com",installs:12,status:"inactive",avatar:"TG",color:"#64748b"},
  ],
  installations: [
    {id:"#1-1005",customer:"Johnson Residence",address:"1234 Pine St, Charlotte",tech:"Mike Johnson",product:"Roller Shades",status:"completed",date:"May 14",time:"08:15 AM"},
    {id:"#1-1006",customer:"Smith Commercial",address:"456 Trade St, Charlotte",tech:"John Smith",product:"Motorized Blinds",status:"in-progress",date:"May 14",time:"09:30 AM"},
    {id:"#1-1007",customer:"Williams Home",address:"789 Oak Ave, Charlotte",tech:"Mike Johnson",product:"Cellular Shades",status:"pending",date:"May 14",time:"11:00 AM"},
    {id:"#1-1008",customer:"Brown Residence",address:"321 Maple Dr, Charlotte",tech:"John Smith",product:"Wood Blinds",status:"pending",date:"May 14",time:"01:00 PM"},
    {id:"#1-1009",customer:"Davis Office",address:"654 Main St, Charlotte",tech:"Anna Davis",product:"Sheer Shades",status:"delayed",date:"May 14",time:"02:15 PM"},
    {id:"#1-1010",customer:"Taylor Home",address:"987 Elm St, Charlotte",tech:"Robert Brown",product:"Roman Shades",status:"completed",date:"May 13",time:"10:00 AM"},
  ],
  documents: [
    {id:1,name:"PO-1005.pdf",type:"Purchase Order",date:"May 14, 2025",size:"2.4 MB",icon:"📕"},
    {id:2,name:"Installation-Johnson.jpg",type:"Installation Photo",date:"May 14, 2025",size:"1.8 MB",icon:"🖼️"},
    {id:3,name:"Order-Smith.pdf",type:"Installation Order",date:"May 13, 2025",size:"2.1 MB",icon:"📕"},
    {id:4,name:"Before-Brown.jpg",type:"Before Photo",date:"May 13, 2025",size:"1.6 MB",icon:"🖼️"},
    {id:5,name:"Inspection-May.pdf",type:"Inspection Report",date:"May 12, 2025",size:"3.2 MB",icon:"📗"},
    {id:6,name:"Route-R21-map.png",type:"Route Map",date:"May 11, 2025",size:"0.9 MB",icon:"🖼️"},
  ],
  inspections: [
    {id:"INS-001",tech:"Anna Davis",date:"May 14, 2025",vehicle:"Truck #2",status:"passed",items:{tools:true,vehicle:true,safety:true,uniform:true,gps:true}},
    {id:"INS-002",tech:"Mike Johnson",date:"May 13, 2025",vehicle:"Truck #3",status:"passed",items:{tools:true,vehicle:true,safety:true,uniform:true,gps:true}},
    {id:"INS-003",tech:"Robert Brown",date:"May 12, 2025",vehicle:"Truck #4",status:"failed",items:{tools:true,vehicle:false,safety:true,uniform:true,gps:true}},
  ],
  routes: [
    {id:"R-21",tech:"Mike Johnson",stops:44,distance:"87.4 mi",eta:"8h 15m",traffic:"Moderate",status:"in-progress",color:"#22c55e"},
    {id:"R-15",tech:"John Smith",stops:38,distance:"72.1 mi",eta:"7h 00m",traffic:"Low",status:"active",color:"#3b82f6"},
    {id:"R-08",tech:"Anna Davis",stops:29,distance:"51.3 mi",eta:"5h 30m",traffic:"High",status:"delayed",color:"#ef4444"},
    {id:"R-33",tech:"Robert Brown",stops:35,distance:"64.8 mi",eta:"6h 45m",traffic:"Low",status:"active",color:"#a855f7"},
  ],
};

const weeklyData=[
  {day:"Mon",completed:110,pending:30},{day:"Tue",completed:95,pending:25},
  {day:"Wed",completed:130,pending:30},{day:"Thu",completed:105,pending:25},
  {day:"Fri",completed:125,pending:30},{day:"Sat",completed:80,pending:20},
  {day:"Sun",completed:65,pending:15},
];
const monthlyTrend=[
  {month:"Jan",installs:380},{month:"Feb",installs:420},{month:"Mar",installs:395},
  {month:"Apr",installs:510},{month:"May",installs:487},
];
const pieData=[
  {name:"Completed",value:68,color:C.green},
  {name:"In Progress",value:38,color:C.blue},
  {name:"Pending",value:17,color:C.amber},
];
const navItems=[
  {icon:LayoutDashboard,label:"Dashboard",id:"dashboard"},
  {icon:Calendar,label:"Schedule",id:"schedule"},
  {icon:Map,label:"Routes",id:"routes"},
  {icon:Wrench,label:"Installations",id:"installs"},
  {icon:Users,label:"Employees",id:"employees"},
  {icon:ClipboardList,label:"Inspections",id:"inspect"},
  {icon:FileText,label:"Documents",id:"docs"},
  {icon:BarChart2,label:"Reports",id:"reports"},
  {icon:Bell,label:"Notifications",id:"notifs"},
  {icon:Settings,label:"Settings",id:"settings"},
];
const bottomNav=[
  {icon:LayoutDashboard,label:"Home",id:"dashboard"},
  {icon:Calendar,label:"Schedule",id:"schedule"},
  {icon:Map,label:"Routes",id:"routes"},
  {icon:ClipboardList,label:"Inspect",id:"inspect"},
  {icon:Bell,label:"Alerts",id:"notifs"},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card=({children,style={}})=><div style={{background:C.surface,borderRadius:12,border:`1px solid ${C.border}`,overflow:"hidden",...style}}>{children}</div>;
const CardHead=({children,style={}})=><div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,...style}}>{children}</div>;
const Btn=({children,variant="default",size="md",onClick,style={}})=>{
  const base={cursor:"pointer",border:"none",borderRadius:8,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"opacity .15s"};
  const variants={
    default:{background:C.blue,color:"#fff",padding:size==="sm"?"5px 10px":"7px 14px",fontSize:size==="sm"?11:12},
    ghost:{background:"#f8fafc",color:C.mid,border:`1px solid ${C.border}`,padding:size==="sm"?"5px 10px":"7px 14px",fontSize:size==="sm"?11:12},
    danger:{background:C.redLt,color:C.red,padding:size==="sm"?"5px 10px":"7px 14px",fontSize:size==="sm"?11:12},
    success:{background:C.greenLt,color:C.greenDk,padding:size==="sm"?"5px 10px":"7px 14px",fontSize:size==="sm"?11:12},
  };
  return <button onClick={onClick} style={{...base,...variants[variant],...style}}>{children}</button>;
};
const Badge=({label,color="blue"})=>{
  const map={blue:{bg:C.blueLt,text:C.blue},green:{bg:C.greenLt,text:C.greenDk},amber:{bg:C.amberLt,text:"#92400e"},red:{bg:C.redLt,text:C.red},purple:{bg:C.purpleLt,text:C.purple},gray:{bg:"#f1f5f9",text:C.muted}};
  const m=map[color]||map.blue;
  return <span style={{background:m.bg,color:m.text,fontSize:10,fontWeight:700,borderRadius:6,padding:"2px 8px",whiteSpace:"nowrap"}}>{label}</span>;
};
const StatusBadge=({status})=>{
  const map={"completed":{label:"Completed",color:"green"},"in-progress":{label:"In Progress",color:"blue"},"pending":{label:"Pending",color:"amber"},"delayed":{label:"Delayed",color:"red"},"active":{label:"Active",color:"blue"},"passed":{label:"Passed",color:"green"},"failed":{label:"Failed",color:"red"},"inactive":{label:"Inactive",color:"gray"}};
  const m=map[status]||{label:status,color:"gray"};
  return <Badge label={m.label} color={m.color}/>;
};
const Input=({label,defaultValue,type="text",placeholder,onChange,value,style={}})=>(
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>{label}</label>}
    <input type={type} defaultValue={defaultValue} value={value} onChange={onChange} placeholder={placeholder}
      style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa",boxSizing:"border-box",...style}}/>
  </div>
);
const Modal=({open,onClose,title,children,width=440})=>{
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:width,boxShadow:"0 20px 60px rgba(0,0,0,.2)",maxHeight:"90vh",overflow:"auto"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:700,fontSize:14,color:C.dark,flex:1}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.faint,padding:4,display:"flex"}}><X size={16}/></button>
        </div>
        <div style={{padding:18}}>{children}</div>
      </div>
    </div>
  );
};
const Toast=({toasts})=>(
  <div style={{position:"fixed",bottom:80,right:16,zIndex:300,display:"flex",flexDirection:"column",gap:8}}>
    {toasts.map(t=>(
      <div key={t.id} style={{background:C.dark,color:"#fff",borderRadius:10,padding:"10px 16px",fontSize:12,fontWeight:500,boxShadow:"0 8px 24px rgba(0,0,0,.2)",display:"flex",alignItems:"center",gap:8,minWidth:200,maxWidth:300}}>
        <span style={{fontSize:16}}>{t.type==="success"?"✅":t.type==="error"?"❌":"ℹ️"}</span>
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({collapsed,onToggle,active,onNav,bp,notifCount}){
  const isRail=bp==="md";
  const show=collapsed||isRail;
  return(
    <aside style={{width:show?56:210,minHeight:"100vh",background:C.sidebar,display:"flex",flexDirection:"column",transition:"width .2s ease",flexShrink:0,zIndex:50}}>
      <div style={{padding:"14px 12px",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${C.sidebarLine}`}}>
        <div style={{width:32,height:32,background:C.blue,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:14,flexShrink:0}}>B</div>
        {!show&&<span style={{color:"#fff",fontWeight:700,fontSize:12,lineHeight:1.2,whiteSpace:"nowrap"}}>BLIND<br/>AMBITIONS</span>}
        {!isRail&&<button onClick={onToggle} style={{marginLeft:"auto",background:"none",border:"none",color:C.faint,cursor:"pointer",padding:2,display:"flex"}}><ChevronLeft size={15} style={{transform:collapsed?"rotate(180deg)":"none",transition:".2s"}}/></button>}
      </div>
      <nav style={{flex:1,padding:"6px 0",overflowY:"auto",overflowX:"hidden"}}>
        {navItems.map(({icon:Icon,label,id})=>{
          const isAct=active===id;
          const badge=id==="notifs"?notifCount:0;
          return(
            <div key={id} onClick={()=>onNav(id)} style={{display:"flex",alignItems:"center",gap:10,padding:show?"10px 0":"10px 14px",justifyContent:show?"center":"flex-start",cursor:"pointer",position:"relative",background:isAct?C.blue:"transparent",borderRadius:isAct&&!show?"0 8px 8px 0":0,margin:isAct&&!show?"0 8px 0 0":0,color:isAct?"#fff":C.faint,transition:"background .15s"}}
              onMouseEnter={e=>{if(!isAct)e.currentTarget.style.background="#334155"}}
              onMouseLeave={e=>{if(!isAct)e.currentTarget.style.background="transparent"}}>
              <Icon size={16} style={{flexShrink:0}}/>
              {!show&&<span style={{fontSize:13,fontWeight:isAct?600:400,whiteSpace:"nowrap"}}>{label}</span>}
              {badge>0&&!show&&<span style={{marginLeft:"auto",background:C.red,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:700}}>{badge}</span>}
              {badge>0&&show&&<span style={{position:"absolute",top:6,right:8,width:7,height:7,background:C.red,borderRadius:"50%"}}/>}
            </div>
          );
        })}
      </nav>
      <div style={{padding:12,borderTop:`1px solid ${C.sidebarLine}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11,flexShrink:0}}>JD</div>
        {!show&&<><div><div style={{color:"#fff",fontSize:12,fontWeight:600}}>John Dispatcher</div><div style={{color:C.muted,fontSize:10}}>Dispatcher</div></div><ChevronRight size={13} style={{color:C.muted,marginLeft:"auto"}}/></>}
      </div>
    </aside>
  );
}

function MobileDrawer({open,onClose,active,onNav,notifCount}){
  return(
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:100}}/>}
      <aside style={{position:"fixed",top:0,left:0,bottom:0,width:240,background:C.sidebar,zIndex:101,display:"flex",flexDirection:"column",transform:open?"translateX(0)":"translateX(-100%)",transition:"transform .25s ease",boxShadow:"4px 0 24px rgba(0,0,0,.3)"}}>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.sidebarLine}`}}>
          <div style={{width:32,height:32,background:C.blue,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",fontSize:14}}>B</div>
          <span style={{color:"#fff",fontWeight:700,fontSize:13,lineHeight:1.2}}>BLIND<br/>AMBITIONS</span>
          <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",color:C.faint,cursor:"pointer",padding:4,display:"flex"}}><X size={18}/></button>
        </div>
        <nav style={{flex:1,padding:"8px 0",overflowY:"auto"}}>
          {navItems.map(({icon:Icon,label,id})=>{
            const isAct=active===id;
            const badge=id==="notifs"?notifCount:0;
            return(
              <div key={id} onClick={()=>{onNav(id);onClose();}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",background:isAct?C.blue:"transparent",color:isAct?"#fff":C.faint,borderRadius:isAct?"0 8px 8px 0":0,margin:isAct?"0 8px 0 0":0,transition:"background .15s"}}>
                <Icon size={18} style={{flexShrink:0}}/>
                <span style={{fontSize:14,fontWeight:isAct?600:400}}>{label}</span>
                {badge>0&&<span style={{marginLeft:"auto",background:C.red,color:"#fff",borderRadius:10,padding:"2px 7px",fontSize:11,fontWeight:700}}>{badge}</span>}
              </div>
            );
          })}
        </nav>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.sidebarLine}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>JD</div>
          <div><div style={{color:"#fff",fontSize:13,fontWeight:600}}>John Dispatcher</div><div style={{color:C.muted,fontSize:11}}>Dispatcher</div></div>
        </div>
      </aside>
    </>
  );
}

function BottomNav({active,onNav,notifCount}){
  return(
    <nav style={{position:"fixed",bottom:0,left:0,right:0,height:60,background:C.sidebar,borderTop:`1px solid ${C.sidebarLine}`,display:"flex",zIndex:90}}>
      {bottomNav.map(({icon:Icon,label,id})=>{
        const isAct=active===id;
        const badge=id==="notifs"?notifCount:0;
        return(
          <button key={id} onClick={()=>onNav(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,border:"none",cursor:"pointer",background:"transparent",color:isAct?C.blue:C.faint,position:"relative",padding:0}}>
            {badge>0&&<span style={{position:"absolute",top:6,right:"calc(50% - 14px)",width:16,height:16,background:C.red,borderRadius:"50%",fontSize:9,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{badge}</span>}
            <Icon size={20}/>
            <span style={{fontSize:9,fontWeight:isAct?700:400}}>{label}</span>
            {isAct&&<span style={{position:"absolute",top:0,left:"25%",right:"25%",height:2,background:C.blue,borderRadius:"0 0 2px 2px"}}/>}
          </button>
        );
      })}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════════

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardView({bp,onNav,addToast}){
  const isMobile=bp==="xs"||bp==="sm";
  const isTablet=bp==="md";
  const kpiCols=isMobile?"repeat(2,1fr)":isTablet?"repeat(3,1fr)":"repeat(5,1fr)";
  const midCols=isMobile?"1fr":isTablet?"1fr 1fr":"1fr 1fr 1fr";
  const routeCols=isMobile?"1fr":"1.4fr 1fr";
  const [optimized,setOptimized]=useState(false);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:kpiCols,gap:10}}>
        <Card style={{padding:"14px 16px",gridColumn:isMobile?"1 / -1":"auto",cursor:"pointer"}} onClick={()=>onNav("installs")}>
          <div style={{fontSize:11,color:C.muted}}>Today's Installations</div>
          <div style={{fontSize:30,fontWeight:800,color:C.dark}}>123</div>
          <div style={{fontSize:11,color:C.green}}>↑ +12% vs yesterday</div>
        </Card>
        {[
          {icon:"🗺️",label:"Active Routes",value:"12",sub:"3 in progress",nav:"routes"},
          {icon:"👷",label:"Technicians Online",value:"34",sub:"of 42",nav:"employees"},
          {icon:"📍",label:"Total Distance",value:"287",sub:"Miles",nav:null},
          {icon:"⚠️",label:"Delayed Jobs",value:"5",sub:"Need attention",accent:C.red,nav:"installs"},
        ].map(k=>(
          <Card key={k.label} style={{padding:"14px 16px",cursor:k.nav?"pointer":"default"}} onClick={()=>k.nav&&onNav(k.nav)}>
            <div style={{display:"flex",alignItems:"center",gap:6,color:C.muted,fontSize:12}}><span>{k.icon}</span><span>{k.label}</span></div>
            <div style={{fontSize:28,fontWeight:800,color:k.accent||C.dark}}>{k.value}</div>
            <div style={{fontSize:11,color:C.faint}}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:midCols,gap:12}}>
        <Card>
          <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Installations by Status</span></CardHead>
          <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:16}}>
            <PieChart width={90} height={90}>
              <Pie data={pieData} cx={45} cy={45} innerRadius={24} outerRadius={42} dataKey="value" strokeWidth={0}>
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
            </PieChart>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {pieData.map(d=>(
                <div key={d.name} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,cursor:"pointer"}} onClick={()=>onNav("installs")}>
                  <span style={{width:9,height:9,borderRadius:"50%",background:d.color,flexShrink:0}}/>
                  <span style={{color:C.muted}}>{d.name}</span>
                  <span style={{fontWeight:700,color:C.dark,marginLeft:2}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHead>
            <span style={{fontWeight:600,fontSize:13,color:C.dark}}>Weekly Performance</span>
          </CardHead>
          <div style={{padding:"10px 12px 8px"}}>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={weeklyData} barSize={10}>
                <XAxis dataKey="day" tick={{fontSize:10,fill:C.faint}} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Bar dataKey="completed" fill={C.blue} radius={[3,3,0,0]} stackId="a"/>
                <Bar dataKey="pending" fill={C.amberLt} radius={[3,3,0,0]} stackId="a"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Load Balance</span></CardHead>
          <div style={{padding:"10px 16px 14px",display:"flex",flexDirection:"column",gap:10}}>
            {INIT.employees.filter(e=>e.installs>0).slice(0,4).map(t=>(
              <div key={t.name} style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:t.color+"22",color:t.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:9,flexShrink:0}}>{t.avatar}</div>
                <span style={{color:C.mid,minWidth:80,fontSize:11}}>{t.name.split(" ")[0]}</span>
                <div style={{flex:1,height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${Math.round(t.installs/50*100)}%`,height:"100%",background:t.color,borderRadius:3,transition:"width .6s ease"}}/>
                </div>
                <span style={{color:C.mid,fontWeight:600,minWidth:20,fontSize:11}}>{t.installs}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Route + Activity */}
      <div style={{display:"grid",gridTemplateColumns:routeCols,gap:12}}>
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <MapPin size={14} color={C.blue}/><span style={{fontWeight:700,fontSize:13,color:C.dark}}>Route R-21</span>
            <span style={{color:C.faint,fontSize:12}}>• Mike Johnson</span>
            <StatusBadge status="in-progress"/>
            <button onClick={()=>onNav("routes")} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:11,fontWeight:600}}>View all →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"8px 14px",borderBottom:`1px solid ${C.border}`}}>
            {[["Stops","44"],["Distance","87.4 mi"],["Est. Time","8h 15m"],["Traffic","Moderate"]].map(([l,v])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:C.faint}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:C.dark}}>{v}</div></div>
            ))}
          </div>
          <div style={{background:"linear-gradient(135deg,#e0f2fe,#bfdbfe)",position:"relative",height:140,overflow:"hidden"}}>
            <svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="none">
              <polyline points="20,120 60,95 100,75 140,60 175,68 210,45 250,30 290,20" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {[[20,120],[100,75],[175,68],[250,30],[290,20]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={5} fill={i===0?"#22c55e":i===4?"#ef4444":C.blue} stroke="#fff" strokeWidth={2}/>
              ))}
            </svg>
            <div style={{position:"absolute",bottom:8,right:10,fontSize:10,color:C.muted,background:"rgba(255,255,255,.8)",borderRadius:4,padding:"2px 6px"}}>Live Route</div>
          </div>
          <div style={{padding:"10px 14px"}}>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <Btn onClick={()=>{addToast("Navigation started","success");}} style={{flex:1}}><Navigation size={12}/>Navigate</Btn>
              <Btn variant="ghost" onClick={()=>addToast("Link copied to clipboard","info")} style={{flex:1}}><Share2 size={12}/>Share</Btn>
              <Btn variant="success" onClick={()=>{setOptimized(true);addToast("Route optimized — saved 18 min","success");}}>
                {optimized?"✅":"✨"}{optimized?"Optimized":"Optimize"}
              </Btn>
            </div>
          </div>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card style={{flex:1}}>
            <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Recent Activity</span></CardHead>
            <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:10}}>
              {INIT.notifications.slice(0,4).map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:12}}>
                  <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{a.type==="success"?"✅":a.type==="warning"?"⚠️":a.type==="error"?"❌":"📄"}</span>
                  <div style={{flex:1}}>
                    <div style={{color:C.mid}}>{a.body}</div>
                    <div style={{color:C.faint,fontSize:10,marginTop:1}}>{a.time}</div>
                  </div>
                </div>
              ))}
              <button onClick={()=>onNav("notifs")} style={{background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:11,fontWeight:600,padding:0,textAlign:"left"}}>View all notifications →</button>
            </div>
          </Card>
          <Card style={{flex:1}}>
            <CardHead>
              <span style={{fontWeight:600,fontSize:13,color:C.dark}}>Upcoming Today</span>
              <button onClick={()=>onNav("schedule")} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.blue,fontSize:11,fontWeight:600}}>View all →</button>
            </CardHead>
            <div style={{padding:"10px 14px",display:"flex",flexDirection:"column",gap:8}}>
              {INIT.installations.slice(0,4).map((u,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:[C.blue,C.green,C.amber,C.purple][i%4],flexShrink:0}}/>
                  <span style={{color:C.muted,minWidth:60}}>{u.time}</span>
                  <span style={{color:C.mid,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.customer}</span>
                  <StatusBadge status={u.status}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── SCHEDULE ──────────────────────────────────────────────────────────────────
function ScheduleView({bp,addToast}){
  const [week,setWeek]=useState("May 12–18, 2025");
  const [view,setView]=useState("week");
  const weeks=["Apr 28 – May 4, 2025","May 5–11, 2025","May 12–18, 2025","May 19–25, 2025","May 26 – Jun 1, 2025"];
  const [wi,setWi]=useState(2);
  const days=["Mon 12","Tue 13","Wed 14","Thu 15","Fri 16"];
  const zoneColors={"#3b82f6":"Southwest","#22c55e":"East","#f59e0b":"North","#a855f7":"West"};
  const data=[
    {emp:INIT.employees[0],days:[42,45,"3Z",38,40]},
    {emp:INIT.employees[1],days:[38,40,"3Z",42,41]},
    {emp:INIT.employees[2],days:[34,36,"3Z",40,35]},
    {emp:INIT.employees[3],days:[40,39,"3Z",41,37]},
  ];
  const [selected,setSelected]=useState(null);

  const prev=()=>{if(wi>0){setWi(wi-1);setWeek(weeks[wi-1]);}};
  const next=()=>{if(wi<weeks.length-1){setWi(wi+1);setWeek(weeks[wi+1]);}};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Schedule</h1>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          <Btn variant="ghost" size="sm" onClick={prev}><ChevronLeft size={13}/></Btn>
          <span style={{fontSize:13,color:C.mid,fontWeight:500,minWidth:140,textAlign:"center"}}>{week}</span>
          <Btn variant="ghost" size="sm" onClick={next}><ChevronRight size={13}/></Btn>
          <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
            {["week","month"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:view===v?C.blue:"#fff",color:view===v?"#fff":C.muted,textTransform:"capitalize"}}>{v}</button>
            ))}
          </div>
          <Btn onClick={()=>addToast("Schedule exported","success")} size="sm"><Download size={12}/>Export</Btn>
        </div>
      </div>

      <Card style={{overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}>
              <th style={{padding:"10px 14px",fontSize:11,color:C.muted,textAlign:"left",fontWeight:600,minWidth:140}}>Technician</th>
              {days.map(d=><th key={d} style={{padding:"10px 10px",fontSize:11,color:C.muted,textAlign:"center",fontWeight:600}}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map(({emp,days:ds},ri)=>(
              <tr key={ri} style={{borderBottom:ri<3?`1px solid ${C.border}`:"none",transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:emp.color+"22",color:emp.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{emp.avatar}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:C.mid}}>{emp.name}</div>
                      <div style={{fontSize:10,color:C.faint}}>{emp.zone}</div>
                    </div>
                  </div>
                </td>
                {ds.map((d,di)=>{
                  const isZone=typeof d==="string";
                  return(
                    <td key={di} style={{padding:"6px 6px",textAlign:"center"}}>
                      <div onClick={()=>setSelected({emp,day:days[di],val:d})} style={{background:isZone?C.redLt:emp.color+"18",color:isZone?C.red:emp.color,borderRadius:6,padding:"5px 4px",fontSize:10,fontWeight:700,cursor:"pointer",border:isZone?`1px solid ${C.red}33`:"none",transition:"transform .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                        {typeof d==="number"?`${d} jobs`:d==="3Z"?"3 Zones":d}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {Object.entries(zoneColors).map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.muted}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:C.red}}/>3 Zones (Wed rule: max 70)
        </div>
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`${selected?.emp?.name} — ${selected?.day}`}>
        {selected&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:selected.emp.color+"22",color:selected.emp.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{selected.emp.avatar}</div>
              <div><div style={{fontWeight:700,fontSize:15,color:C.dark}}>{selected.emp.name}</div><div style={{fontSize:12,color:C.muted}}>{selected.emp.role} · {selected.emp.zone}</div></div>
            </div>
            <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",display:"flex",flexDirection:"column",gap:6}}>
              <div style={{fontSize:12,color:C.mid}}><b>Day:</b> {selected.day}</div>
              <div style={{fontSize:12,color:C.mid}}><b>Jobs:</b> {selected.val}</div>
              <div style={{fontSize:12,color:C.mid}}><b>Zone:</b> {selected.emp.zone}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{addToast(`${selected.emp.name} reassigned`,"success");setSelected(null);}} style={{flex:1}}>Reassign</Btn>
              <Btn variant="ghost" onClick={()=>setSelected(null)} style={{flex:1}}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── ROUTES ────────────────────────────────────────────────────────────────────
function RoutesView({bp,addToast}){
  const [selected,setSelected]=useState(INIT.routes[0]);
  const [optimized,setOptimized]=useState({});
  const stops=[
    {time:"08:00 AM",name:"Start Point",status:"done"},
    {time:"08:15 AM",name:"Johnson Residence",status:"done"},
    {time:"09:30 AM",name:"Smith Commercial",status:"done"},
    {time:"11:00 AM",name:"Williams Home",status:"active"},
    {time:"01:00 PM",name:"Brown Residence",status:"pending"},
    {time:"02:15 PM",name:"Davis Office",status:"pending"},
  ];
  const isMobile=bp==="xs"||bp==="sm";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Routes</h1>
        <Btn onClick={()=>addToast("New route created","success")} size="sm" style={{marginLeft:"auto"}}><Plus size={12}/>New Route</Btn>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1.6fr",gap:14}}>
        {/* Route list */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {INIT.routes.map(r=>(
            <Card key={r.id} style={{cursor:"pointer",border:selected.id===r.id?`2px solid ${C.blue}`:`1px solid ${C.border}`,transition:"border .15s"}} onClick={()=>setSelected(r)}>
              <div style={{padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:r.color+"22",color:r.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{r.id}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.dark}}>{r.id}</div>
                    <div style={{fontSize:11,color:C.muted}}>{r.tech}</div>
                  </div>
                  <StatusBadge status={r.status}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                  {[["Stops",r.stops],["Distance",r.distance],["ETA",r.eta]].map(([l,v])=>(
                    <div key={l} style={{textAlign:"center",background:"#f8fafc",borderRadius:6,padding:"4px 6px"}}>
                      <div style={{fontSize:9,color:C.faint}}>{l}</div>
                      <div style={{fontSize:11,fontWeight:700,color:C.mid}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Route detail */}
        <Card>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
            <MapPin size={14} color={C.blue}/>
            <span style={{fontWeight:700,fontSize:14,color:C.dark}}>{selected.id}</span>
            <span style={{color:C.faint,fontSize:12}}>• {selected.tech}</span>
            <StatusBadge status={selected.status}/>
            <MoreVertical size={14} color={C.faint} style={{marginLeft:"auto",cursor:"pointer"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"8px 14px",borderBottom:`1px solid ${C.border}`}}>
            {[["Stops",selected.stops],["Distance",selected.distance],["Est. Time",selected.eta],["Traffic",selected.traffic]].map(([l,v])=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:10,color:C.faint}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:C.dark}}>{v}</div></div>
            ))}
          </div>
          {/* Map */}
          <div style={{background:"linear-gradient(135deg,#e0f2fe,#bfdbfe,#ddd6fe)",position:"relative",height:200,overflow:"hidden"}}>
            <svg width="100%" height="100%" viewBox="0 0 380 200" preserveAspectRatio="none">
              <polyline points="20,170 70,130 120,100 170,80 210,90 260,60 310,35 360,20" fill="none" stroke={selected.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              {[[20,170],[120,100],[210,90],[310,35],[360,20]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={6} fill={i===0?"#22c55e":i===4?"#ef4444":selected.color} stroke="#fff" strokeWidth={2}/>
              ))}
            </svg>
            <div style={{position:"absolute",bottom:8,right:10,fontSize:10,color:C.muted,background:"rgba(255,255,255,.85)",borderRadius:4,padding:"2px 6px"}}>🟢 Live</div>
          </div>
          {/* Stops */}
          <div style={{padding:"10px 14px"}}>
            <div style={{fontSize:12,fontWeight:600,color:C.dark,marginBottom:7}}>Stops ({selected.stops})</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:180,overflowY:"auto"}}>
              {stops.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:11}}>
                  <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:s.status==="done"?C.green:s.status==="active"?C.blue:"#e2e8f0",color:s.status==="pending"?C.faint:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{i+1}</div>
                  <span style={{flex:1,color:s.status==="active"?C.blue:C.mid,fontWeight:s.status==="active"?600:400}}>{s.name}</span>
                  <span style={{color:C.faint}}>{s.time}</span>
                  {s.status==="done"&&<Check size={12} color={C.green}/>}
                  {s.status==="active"&&<span style={{width:7,height:7,borderRadius:"50%",background:C.blue,display:"inline-block"}}/>}
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <Btn onClick={()=>addToast("Navigation started","success")} style={{flex:1}}><Navigation size={12}/>Navigate</Btn>
              <Btn variant="ghost" onClick={()=>addToast("Route link copied","info")} style={{flex:1}}><Share2 size={12}/>Share</Btn>
              <Btn variant="success" onClick={()=>{setOptimized(p=>({...p,[selected.id]:true}));addToast(`Route ${selected.id} optimized — saved 18 min`,"success");}}>
                {optimized[selected.id]?"✅ Done":"✨ Optimize"}
              </Btn>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── INSTALLATIONS ─────────────────────────────────────────────────────────────
function InstallsView({bp,addToast}){
  const [installs,setInstalls]=useState(INIT.installations);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({customer:"",address:"",tech:"",product:"",notes:""});
  const isMobile=bp==="xs"||bp==="sm";

  const filtered=installs.filter(i=>{
    const matchF=filter==="all"||i.status===filter;
    const matchS=!search||(i.customer.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase()));
    return matchF&&matchS;
  });

  const updateStatus=(id,status)=>{
    setInstalls(p=>p.map(i=>i.id===id?{...i,status}:i));
    addToast(`Status updated to ${status}`,"success");
    setSelected(null);
  };

  const addInstall=()=>{
    if(!form.customer.trim()){addToast("Customer name required","error");return;}
    const newI={id:`#1-${1010+installs.length}`,customer:form.customer,address:form.address||"N/A",tech:form.tech||"Unassigned",product:form.product||"TBD",status:"pending",date:"May 27",time:"09:00 AM"};
    setInstalls(p=>[newI,...p]);
    setShowForm(false);
    setForm({customer:"",address:"",tech:"",product:"",notes:""});
    addToast("Installation added","success");
  };

  const tabs=["all","pending","in-progress","completed","delayed"];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Installations</h1>
        <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.faint}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{paddingLeft:28,height:32,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:"none",color:C.mid,background:"#fafafa",width:180}}/>
          </div>
          <Btn onClick={()=>setShowForm(true)}><Plus size={12}/>Add Installation</Btn>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{padding:"5px 14px",borderRadius:7,cursor:"pointer",fontSize:11,fontWeight:600,background:filter===t?C.blue:"#fff",color:filter===t?"#fff":C.muted,border:filter===t?"1px solid transparent":`1px solid ${C.border}`,whiteSpace:"nowrap",flexShrink:0,transition:"background .15s",textTransform:"capitalize"}}>
            {t==="all"?"All Jobs":t.replace("-"," ")}
            {t==="all"&&<span style={{marginLeft:5,background:"rgba(255,255,255,.3)",borderRadius:4,padding:"1px 5px"}}>{installs.length}</span>}
          </button>
        ))}
      </div>

      <Card style={{overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
          <thead>
            <tr style={{background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}>
              {["ID","Customer","Technician","Product","Date","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"10px 12px",fontSize:11,color:C.muted,textAlign:"left",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length===0&&(
              <tr><td colSpan={7} style={{padding:24,textAlign:"center",color:C.faint,fontSize:13}}>No installations found</td></tr>
            )}
            {filtered.map((inst,i)=>(
              <tr key={inst.id} style={{borderBottom:i<filtered.length-1?`1px solid #f8fafc`:"none",transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px",fontSize:12,fontWeight:600,color:C.blue}}>{inst.id}</td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{fontSize:12,fontWeight:500,color:C.mid}}>{inst.customer}</div>
                  <div style={{fontSize:10,color:C.faint}}>{inst.address}</div>
                </td>
                <td style={{padding:"10px 12px",fontSize:12,color:C.mid}}>{inst.tech}</td>
                <td style={{padding:"10px 12px",fontSize:12,color:C.mid}}>{inst.product}</td>
                <td style={{padding:"10px 12px",fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{inst.date} {inst.time}</td>
                <td style={{padding:"10px 12px"}}><StatusBadge status={inst.status}/></td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>setSelected(inst)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 6px",cursor:"pointer",color:C.muted,display:"flex"}}><Eye size={12}/></button>
                    <button onClick={()=>{setSelected(inst);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 6px",cursor:"pointer",color:C.blue,display:"flex"}}><Edit2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Installation ${selected?.id}`}>
        {selected&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Customer",selected.customer],["Technician",selected.tech],["Address",selected.address],["Product",selected.product],["Date",`${selected.date} ${selected.time}`],["Status",selected.status]].map(([l,v])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>{l}</div>
                  {l==="Status"?<StatusBadge status={v}/>:<div style={{fontSize:12,color:C.mid,fontWeight:500}}>{v}</div>}
                </div>
              ))}
            </div>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,marginTop:4}}>Update Status</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["pending","in-progress","completed","delayed"].map(s=>(
                <Btn key={s} size="sm" variant={selected.status===s?"default":"ghost"} onClick={()=>updateStatus(selected.id,s)} style={{textTransform:"capitalize"}}>{s.replace("-"," ")}</Btn>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Form Modal */}
      <Modal open={showForm} onClose={()=>setShowForm(false)} title="New Installation">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Customer Name" value={form.customer} onChange={e=>setForm(p=>({...p,customer:e.target.value}))} placeholder="Johnson Residence"/>
            <Input label="Phone" placeholder="(704) 555-0000"/>
          </div>
          <Input label="Address" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} placeholder="1234 Pine St, Charlotte"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Technician</label>
              <select value={form.tech} onChange={e=>setForm(p=>({...p,tech:e.target.value}))} style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa"}}>
                <option value="">Select...</option>
                {INIT.employees.filter(e=>e.role==="Technician"||e.role==="Lead Technician").map(e=><option key={e.id} value={e.name}>{e.name}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Product</label>
              <select value={form.product} onChange={e=>setForm(p=>({...p,product:e.target.value}))} style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa"}}>
                <option value="">Select...</option>
                {["Roller Shades","Motorized Blinds","Cellular Shades","Wood Blinds","Sheer Shades","Roman Shades"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="Additional notes..." style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,resize:"none",background:"#fafafa"}}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={addInstall} style={{flex:1}}><Check size={12}/>Save Installation</Btn>
            <Btn variant="ghost" onClick={()=>setShowForm(false)} style={{flex:1}}>Cancel</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── EMPLOYEES ─────────────────────────────────────────────────────────────────
function EmployeesView({bp,addToast}){
  const [employees,setEmployees]=useState(INIT.employees);
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [showAdd,setShowAdd]=useState(false);

  const filtered=employees.filter(e=>!search||e.name.toLowerCase().includes(search.toLowerCase())||e.zone.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus=id=>{
    setEmployees(p=>p.map(e=>e.id===id?{...e,status:e.status==="active"?"inactive":"active"}:e));
    addToast("Employee status updated","success");
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Employees</h1>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.faint}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{paddingLeft:28,height:32,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:"none",color:C.mid,background:"#fafafa",width:160}}/>
          </div>
          <Btn onClick={()=>setShowAdd(true)}><Plus size={12}/>Add Employee</Btn>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:bp==="xs"?"1fr":bp==="sm"?"1fr 1fr":bp==="md"?"1fr 1fr 1fr":"repeat(3,1fr)",gap:12}}>
        {filtered.map(emp=>(
          <Card key={emp.id} style={{cursor:"pointer",transition:"transform .15s,box-shadow .15s"}}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.08)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}
            onClick={()=>setSelected(emp)}>
            <div style={{padding:"16px 16px 14px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:emp.color+"22",color:emp.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{emp.avatar}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.dark,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{emp.name}</div>
                  <div style={{fontSize:11,color:C.muted}}>{emp.role}</div>
                </div>
                <StatusBadge status={emp.status}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <div style={{background:"#f8fafc",borderRadius:6,padding:"6px 8px"}}>
                  <div style={{fontSize:9,color:C.faint,marginBottom:1}}>Zone</div>
                  <div style={{fontSize:11,fontWeight:600,color:C.mid}}>{emp.zone}</div>
                </div>
                <div style={{background:"#f8fafc",borderRadius:6,padding:"6px 8px"}}>
                  <div style={{fontSize:9,color:C.faint,marginBottom:1}}>Installs</div>
                  <div style={{fontSize:11,fontWeight:700,color:C.blue}}>{emp.installs}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginTop:10}}>
                <button onClick={e=>{e.stopPropagation();window.open(`tel:${emp.phone}`);}} style={{flex:1,padding:"5px 0",background:"#f8fafc",border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:C.muted}}>
                  <Phone size={11}/>Call
                </button>
                <button onClick={e=>{e.stopPropagation();addToast(`Email drafted to ${emp.name}`,"info");}} style={{flex:1,padding:"5px 0",background:"#f8fafc",border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:C.muted}}>
                  <Mail size={11}/>Email
                </button>
                <button onClick={e=>{e.stopPropagation();toggleStatus(emp.id);}} style={{flex:1,padding:"5px 0",background:"#f8fafc",border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,fontSize:11,color:emp.status==="active"?C.red:C.green}}>
                  {emp.status==="active"?"Deactivate":"Activate"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Employee Details">
        {selected&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:selected.color+"22",color:selected.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18}}>{selected.avatar}</div>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:C.dark}}>{selected.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{selected.role} · {selected.zone} Zone</div>
                <div style={{marginTop:4}}><StatusBadge status={selected.status}/></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Phone",selected.phone],["Email",selected.email],["Zone",selected.zone],["Installations",selected.installs.toString()]].map(([l,v])=>(
                <div key={l} style={{background:"#f8fafc",borderRadius:7,padding:"8px 10px"}}>
                  <div style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:12,color:C.mid,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={()=>{addToast(`Message sent to ${selected.name}`,"success");setSelected(null);}} style={{flex:1}}><Send size={12}/>Message</Btn>
              <Btn variant="ghost" onClick={()=>setSelected(null)} style={{flex:1}}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Employee">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Full Name" placeholder="John Smith"/>
            <Input label="Phone" placeholder="(704) 555-0000"/>
          </div>
          <Input label="Email" type="email" placeholder="john@blindambitions.com"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Role</label>
              <select style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa"}}>
                {["Technician","Lead Technician","Inspector","Dispatcher","Trainee"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Zone</label>
              <select style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa"}}>
                {["Southwest","East","North","West","All"].map(z=><option key={z}>{z}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={()=>{addToast("Employee added","success");setShowAdd(false);}} style={{flex:1}}><Check size={12}/>Add Employee</Btn>
            <Btn variant="ghost" onClick={()=>setShowAdd(false)} style={{flex:1}}>Cancel</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── INSPECTIONS ───────────────────────────────────────────────────────────────
function InspectionsView({bp,addToast}){
  const [items,setItems]=useState({tools:true,vehicle:true,safety:true,uniform:true,gps:true});
  const [submitted,setSubmitted]=useState(false);
  const [history,setHistory]=useState(INIT.inspections);
  const [showHistory,setShowHistory]=useState(false);
  const [selTech,setSelTech]=useState(INIT.employees[0].name);
  const [month,setMonth]=useState("May 2025");

  const toggle=k=>setItems(p=>({...p,[k]:!p[k]}));
  const allPass=Object.values(items).every(Boolean);

  const submit=()=>{
    const newInsp={id:`INS-00${history.length+1}`,tech:selTech,date:"May 27, 2025",vehicle:"Truck #1",status:allPass?"passed":"failed",items:{...items}};
    setHistory(p=>[newInsp,...p]);
    setSubmitted(true);
    addToast(`Inspection ${newInsp.status.toUpperCase()} — submitted successfully`,allPass?"success":"error");
  };
  const reset=()=>{setItems({tools:true,vehicle:true,safety:true,uniform:true,gps:true});setSubmitted(false);};

  const inspFields=[
    {key:"tools",label:"Tools Condition",note:"Check all tools present and functional"},
    {key:"vehicle",label:"Vehicle Inspection",note:"Exterior, tires, lights and fluid levels"},
    {key:"safety",label:"Safety Equipment",note:"PPE, first aid kit, fire extinguisher"},
    {key:"uniform",label:"Uniform & ID",note:"Clean uniform with company badge"},
    {key:"gps",label:"GPS Device",note:"Tracking app active and connected"},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Inspections</h1>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn variant="ghost" onClick={()=>setShowHistory(p=>!p)}><Layers size={12}/>{showHistory?"Hide":"View"} History</Btn>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:bp==="xs"||bp==="sm"?"1fr":"1fr 1fr",gap:14}}>
        {/* Form */}
        <Card>
          <div style={{padding:"10px 16px",background:"#14532d",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>Monthly Inspection Form</span>
            <div style={{marginLeft:"auto",background:"rgba(255,255,255,.15)",borderRadius:5,padding:"3px 10px",color:"#fff",fontSize:11}}>{month}</div>
          </div>
          <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
            {submitted?(
              <div style={{textAlign:"center",padding:"24px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:allPass?C.greenLt:C.redLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{allPass?"✅":"❌"}</div>
                <div style={{fontSize:16,fontWeight:700,color:C.dark}}>{allPass?"Inspection Passed":"Inspection Failed"}</div>
                <div style={{fontSize:12,color:C.muted}}>{selTech} · May 27, 2025</div>
                <Btn variant="ghost" onClick={reset}>Start New Inspection</Btn>
              </div>
            ):(
              <>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Technician</label>
                  <select value={selTech} onChange={e=>setSelTech(e.target.value)} style={{border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 10px",fontSize:12,outline:"none",color:C.mid,background:"#fafafa"}}>
                    {INIT.employees.map(e=><option key={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div style={{borderBottom:`1px solid ${C.border}`,paddingBottom:8,display:"grid",gridTemplateColumns:"1fr auto auto",gap:6}}>
                  <span style={{fontSize:10,color:C.faint,fontWeight:600}}>Item</span>
                  <span style={{fontSize:10,color:C.faint,fontWeight:600,textAlign:"center",minWidth:50}}>Status</span>
                  <span style={{fontSize:10,color:C.faint,fontWeight:600,textAlign:"center",minWidth:40}}>Pass</span>
                </div>
                {inspFields.map(f=>(
                  <div key={f.key} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:6,alignItems:"center",borderBottom:`1px solid #f8fafc`,paddingBottom:8}}>
                    <div>
                      <div style={{fontSize:12,color:C.mid,fontWeight:500}}>{f.label}</div>
                      <div style={{fontSize:10,color:C.faint}}>{f.note}</div>
                    </div>
                    <div style={{minWidth:50,textAlign:"center"}}>
                      <span style={{fontSize:10,background:items[f.key]?C.greenLt:C.redLt,color:items[f.key]?C.greenDk:C.red,borderRadius:4,padding:"2px 7px",fontWeight:600}}>
                        {items[f.key]?"OK":"FAIL"}
                      </span>
                    </div>
                    <div style={{minWidth:40,display:"flex",justifyContent:"center"}}>
                      <div onClick={()=>toggle(f.key)} style={{width:22,height:22,borderRadius:6,background:items[f.key]?C.green:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"background .15s"}}>
                        {items[f.key]&&<Check size={12} color="#fff"/>}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:10,color:C.faint,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>Inspector Signature</label>
                  <div style={{border:`1px solid ${C.border}`,borderRadius:7,height:48,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"cursive",fontSize:18,color:C.mid,background:"#fafafa"}}>
                    {selTech.split(" ")[0]} {selTech.split(" ")[1]?.[0]}.
                  </div>
                </div>
                <button onClick={submit} style={{width:"100%",padding:"10px 0",background:allPass?C.greenDk:"#dc2626",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",transition:"opacity .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  {allPass?"✅ Submit Inspection":"⚠️ Submit with Failures"}
                </button>
              </>
            )}
          </div>
        </Card>

        {/* Stats + History */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Total Inspections",value:history.length,color:C.blue},
              {label:"Passed",value:history.filter(h=>h.status==="passed").length,color:C.green},
              {label:"Failed",value:history.filter(h=>h.status==="failed").length,color:C.red},
              {label:"Pass Rate",value:`${Math.round(history.filter(h=>h.status==="passed").length/history.length*100)}%`,color:C.amber},
            ].map(s=>(
              <Card key={s.label} style={{padding:"14px 16px"}}>
                <div style={{fontSize:11,color:C.muted}}>{s.label}</div>
                <div style={{fontSize:24,fontWeight:800,color:s.color}}>{s.value}</div>
              </Card>
            ))}
          </div>
          {showHistory&&(
            <Card>
              <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Inspection History</span></CardHead>
              <div style={{padding:"8px 0",maxHeight:280,overflowY:"auto"}}>
                {history.map((h,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderBottom:i<history.length-1?`1px solid #f8fafc`:"none"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:h.status==="passed"?C.greenLt:C.redLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{h.status==="passed"?"✅":"❌"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:C.mid}}>{h.tech}</div>
                      <div style={{fontSize:10,color:C.faint}}>{h.date} · {h.vehicle}</div>
                    </div>
                    <StatusBadge status={h.status}/>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────
function DocumentsView({bp,addToast}){
  const [docs,setDocs]=useState(INIT.documents);
  const [search,setSearch]=useState("");
  const [dragging,setDragging]=useState(false);
  const [filter,setFilter]=useState("all");
  const inputRef=useRef();

  const types=["all","Purchase Order","Installation Photo","Inspection Report","Route Map","Installation Order","Before Photo"];
  const filtered=docs.filter(d=>{
    const ms=!search||d.name.toLowerCase().includes(search.toLowerCase());
    const mt=filter==="all"||d.type===filter;
    return ms&&mt;
  });

  const addDoc=(name)=>{
    const newDoc={id:docs.length+1,name,type:"Uploaded File",date:"May 27, 2025",size:"1.0 MB",icon:"📎"};
    setDocs(p=>[newDoc,...p]);
    addToast(`${name} uploaded successfully`,"success");
  };

  const deleteDoc=(id)=>{
    setDocs(p=>p.filter(d=>d.id!==id));
    addToast("Document deleted","success");
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Documents</h1>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:C.faint}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files..." style={{paddingLeft:28,height:32,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:"none",color:C.mid,background:"#fafafa",width:170}}/>
          </div>
          <Btn onClick={()=>inputRef.current.click()}><Upload size={12}/>Upload</Btn>
          <input ref={inputRef} type="file" style={{display:"none"}} onChange={e=>{if(e.target.files[0])addDoc(e.target.files[0].name);e.target.value="";}}/>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);const f=e.dataTransfer.files[0];if(f)addDoc(f.name);}}
        onClick={()=>inputRef.current.click()}
        style={{border:`2px dashed ${dragging?C.blue:"#c7d2fe"}`,borderRadius:12,padding:"24px 16px",textAlign:"center",background:dragging?"#eff6ff":"#f5f3ff",cursor:"pointer",transition:"all .2s"}}>
        <div style={{fontSize:28,marginBottom:4}}>☁️</div>
        <div style={{fontSize:12,color:"#6366f1",fontWeight:600}}>{dragging?"Release to upload":"Drag & drop files here"}</div>
        <div style={{fontSize:11,color:C.faint,marginTop:2}}>or click to browse · JPG, PNG, PDF (Max 10MB)</div>
      </div>

      {/* Type filter */}
      <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>
        {["all","Purchase Order","Photo","Report"].map(t=>(
          <button key={t} onClick={()=>setFilter(t==="Photo"?"Installation Photo":t==="Report"?"Inspection Report":t)}
            style={{padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,background:filter===(t==="Photo"?"Installation Photo":t==="Report"?"Inspection Report":t)?C.blue:"#fff",color:filter===(t==="Photo"?"Installation Photo":t==="Report"?"Inspection Report":t)?"#fff":C.muted,border:`1px solid ${C.border}`,whiteSpace:"nowrap",flexShrink:0}}>
            {t}
          </button>
        ))}
      </div>

      <Card>
        {filtered.length===0&&(
          <div style={{padding:32,textAlign:"center",color:C.faint,fontSize:13}}>No documents found</div>
        )}
        {filtered.map((f,i)=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<filtered.length-1?`1px solid #f8fafc`:"none",transition:"background .1s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:24,flexShrink:0}}>{f.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:C.mid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
              <div style={{fontSize:10,color:C.faint,display:"flex",gap:8}}><span>{f.type}</span><span>·</span><span>{f.date}</span><span>·</span><span>{f.size}</span></div>
            </div>
            <div style={{display:"flex",gap:4,flexShrink:0}}>
              <button onClick={()=>addToast(`${f.name} downloaded`,"success")} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 7px",cursor:"pointer",color:C.blue,display:"flex"}}><Download size={12}/></button>
              <button onClick={()=>deleteDoc(f.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 7px",cursor:"pointer",color:C.red,display:"flex"}}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </Card>
      <div style={{fontSize:11,color:C.faint,textAlign:"right"}}>{filtered.length} of {docs.length} files</div>
    </div>
  );
}

// ── REPORTS ───────────────────────────────────────────────────────────────────
function ReportsView({bp,addToast}){
  const [period,setPeriod]=useState("weekly");
  const isMobile=bp==="xs"||bp==="sm";

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Reports & Analytics</h1>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:7,overflow:"hidden"}}>
            {["weekly","monthly"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{padding:"5px 12px",border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:period===p?C.blue:"#fff",color:period===p?"#fff":C.muted,textTransform:"capitalize"}}>{p}</button>
            ))}
          </div>
          <Btn onClick={()=>addToast("Report exported as PDF","success")} size="sm"><Download size={12}/>Export PDF</Btn>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:10}}>
        {[
          {label:"Total Installations",value:"487",change:"+8.2%",up:true,color:C.blue},
          {label:"Completion Rate",value:"91%",change:"+2.1%",up:true,color:C.green},
          {label:"Avg Jobs / Tech",value:"32.4",change:"-1.3",up:false,color:C.amber},
          {label:"On-Time Rate",value:"87%",change:"+4.5%",up:true,color:C.purple},
        ].map(s=>(
          <Card key={s.label} style={{padding:"14px 16px"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:2}}>{s.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:s.color,lineHeight:1.2}}>{s.value}</div>
            <div style={{fontSize:11,color:s.up?C.green:C.red,marginTop:2}}>{s.up?"↑":"↓"} {s.change}</div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
        <Card>
          <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Installation Volume</span></CardHead>
          <div style={{padding:"10px 12px 8px"}}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="day" tick={{fontSize:10,fill:C.faint}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:C.faint}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:`1px solid ${C.border}`}}/>
                <Bar dataKey="completed" fill={C.blue} radius={[3,3,0,0]} name="Completed"/>
                <Bar dataKey="pending" fill={C.amberLt} radius={[3,3,0,0]} name="Pending"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Monthly Trend</span></CardHead>
          <div style={{padding:"10px 12px 8px"}}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:C.faint}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:C.faint}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:`1px solid ${C.border}`}}/>
                <Line type="monotone" dataKey="installs" stroke={C.blue} strokeWidth={2} dot={{fill:C.blue,r:4}} name="Installations"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHead><span style={{fontWeight:600,fontSize:13,color:C.dark}}>Technician Performance</span></CardHead>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:420}}>
            <thead>
              <tr style={{background:"#f8fafc",borderBottom:`1px solid ${C.border}`}}>
                {["Technician","Zone","Installations","Completion Rate","On-Time","Load"].map(h=>(
                  <th key={h} style={{padding:"10px 12px",fontSize:11,color:C.muted,textAlign:"left",fontWeight:600}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INIT.employees.filter(e=>e.installs>0).map((emp,i)=>{
                const rate=Math.round(80+Math.random()*18);
                const ot=Math.round(75+Math.random()*20);
                const load=Math.round(emp.installs/50*100);
                return(
                  <tr key={emp.id} style={{borderBottom:i<3?`1px solid #f8fafc`:"none"}}>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:26,height:26,borderRadius:"50%",background:emp.color+"22",color:emp.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{emp.avatar}</div>
                        <span style={{fontSize:12,fontWeight:500,color:C.mid}}>{emp.name}</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px",fontSize:12,color:C.muted}}>{emp.zone}</td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:C.blue}}>{emp.installs}</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:rate>90?C.green:rate>75?C.amber:C.red,fontWeight:600}}>{rate}%</td>
                    <td style={{padding:"10px 12px",fontSize:12,color:ot>85?C.green:C.amber,fontWeight:600}}>{ot}%</td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,height:6,background:"#f1f5f9",borderRadius:3,overflow:"hidden",minWidth:60}}>
                          <div style={{width:`${load}%`,height:"100%",background:emp.color,borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:11,color:C.muted,minWidth:28}}>{load}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
function NotificationsView({notifs,setNotifs,addToast}){
  const [filter,setFilter]=useState("all");
  const unread=notifs.filter(n=>!n.read).length;

  const markRead=id=>setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const markAll=()=>{setNotifs(p=>p.map(n=>({...n,read:true})));addToast("All notifications marked as read","success");};
  const deleteN=id=>{setNotifs(p=>p.filter(n=>n.id!==id));addToast("Notification removed","success");};

  const typeIcon={success:"✅",warning:"⚠️",error:"❌",info:"ℹ️"};
  const typeColor={success:C.green,warning:C.amber,error:C.red,info:C.blue};

  const filtered=notifs.filter(n=>filter==="all"||n.type===filter||(filter==="unread"&&!n.read));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Notifications</h1>
        {unread>0&&<Badge label={`${unread} unread`} color="red"/>}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          {unread>0&&<Btn variant="ghost" size="sm" onClick={markAll}><Check size={12}/>Mark all read</Btn>}
        </div>
      </div>

      <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:2}}>
        {["all","unread","success","warning","error","info"].map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600,background:filter===t?C.blue:"#fff",color:filter===t?"#fff":C.muted,border:`1px solid ${C.border}`,whiteSpace:"nowrap",flexShrink:0,textTransform:"capitalize"}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.length===0&&(
          <Card style={{padding:32,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{fontSize:14,fontWeight:600,color:C.dark}}>All caught up!</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>No notifications to show</div>
          </Card>
        )}
        {filtered.map(n=>(
          <Card key={n.id} style={{border:!n.read?`1px solid ${C.blueLt}`:undefined,background:!n.read?"#fafeff":undefined,cursor:"pointer"}} onClick={()=>markRead(n.id)}>
            <div style={{padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:typeColor[n.type]+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{typeIcon[n.type]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.dark}}>{n.title}</span>
                  {!n.read&&<span style={{width:7,height:7,borderRadius:"50%",background:C.blue,flexShrink:0}}/>}
                </div>
                <div style={{fontSize:12,color:C.muted}}>{n.body}</div>
                <div style={{fontSize:10,color:C.faint,marginTop:3}}>{n.time}</div>
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                {!n.read&&<button onClick={e=>{e.stopPropagation();markRead(n.id);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 7px",cursor:"pointer",color:C.blue,fontSize:10,fontWeight:600}}>Read</button>}
                <button onClick={e=>{e.stopPropagation();deleteN(n.id);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 6px",cursor:"pointer",color:C.red,display:"flex"}}><Trash2 size={11}/></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function SettingsView({addToast}){
  const [settings,setSettings]=useState({
    notifications:true,emailAlerts:true,smsAlerts:false,
    autoOptimize:true,darkMode:false,language:"en",
    timezone:"America/New_York",maxZones:3,
    name:"John Dispatcher",email:"john.dispatcher@blindambitions.com",role:"Dispatcher",
  });
  const toggle=k=>setSettings(p=>({...p,[k]:!p[k]}));

  const ToggleSwitch=({value,onChange})=>(
    <div onClick={onChange} style={{width:42,height:22,borderRadius:11,background:value?C.blue:"#e2e8f0",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:value?22:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.15)"}}/>
    </div>
  );

  const Section=({title,children})=>(
    <Card>
      <CardHead><span style={{fontWeight:700,fontSize:13,color:C.dark}}>{title}</span></CardHead>
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:12}}>{children}</div>
    </Card>
  );

  const SettingRow=({label,sub,children})=>(
    <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
      <div><div style={{fontSize:12,fontWeight:500,color:C.mid}}>{label}</div>{sub&&<div style={{fontSize:11,color:C.faint}}>{sub}</div>}</div>
      {children}
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:680}}>
      <h1 style={{fontSize:18,fontWeight:700,color:C.dark,margin:0}}>Settings</h1>

      <Section title="👤 Profile">
        <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:C.blue+"22",color:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16}}>JD</div>
          <div style={{flex:1}}>
            <input value={settings.name} onChange={e=>setSettings(p=>({...p,name:e.target.value}))} style={{fontWeight:700,fontSize:14,color:C.dark,border:"none",outline:"none",background:"transparent",width:"100%"}}/>
            <div style={{fontSize:11,color:C.muted}}>{settings.role}</div>
          </div>
          <Btn variant="ghost" size="sm" onClick={()=>addToast("Profile saved","success")}><Save size={11}/>Save</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Input label="Display Name" value={settings.name} onChange={e=>setSettings(p=>({...p,name:e.target.value}))}/>
          <Input label="Email" value={settings.email} onChange={e=>setSettings(p=>({...p,email:e.target.value}))}/>
        </div>
      </Section>

      <Section title="🔔 Notifications">
        <SettingRow label="Push Notifications" sub="Receive alerts in the app">
          <ToggleSwitch value={settings.notifications} onChange={()=>toggle("notifications")}/>
        </SettingRow>
        <SettingRow label="Email Alerts" sub="Daily summary and urgent alerts">
          <ToggleSwitch value={settings.emailAlerts} onChange={()=>toggle("emailAlerts")}/>
        </SettingRow>
        <SettingRow label="SMS Alerts" sub="Critical notifications via text">
          <ToggleSwitch value={settings.smsAlerts} onChange={()=>toggle("smsAlerts")}/>
        </SettingRow>
      </Section>

      <Section title="🗺️ Routes & Operations">
        <SettingRow label="Auto-Optimize Routes" sub="Automatically improve routes when traffic detected">
          <ToggleSwitch value={settings.autoOptimize} onChange={()=>toggle("autoOptimize")}/>
        </SettingRow>
        <SettingRow label="Max Zones per Technician (Wed)" sub="Maximum concurrent zones on restricted days">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setSettings(p=>({...p,maxZones:Math.max(1,p.maxZones-1)}))} style={{width:28,height:28,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",color:C.mid,fontWeight:700}}>−</button>
            <span style={{minWidth:20,textAlign:"center",fontSize:14,fontWeight:700,color:C.dark}}>{settings.maxZones}</span>
            <button onClick={()=>setSettings(p=>({...p,maxZones:Math.min(5,p.maxZones+1)}))} style={{width:28,height:28,border:`1px solid ${C.border}`,borderRadius:6,cursor:"pointer",background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",color:C.mid,fontWeight:700}}>+</button>
          </div>
        </SettingRow>
        <SettingRow label="Timezone">
          <select value={settings.timezone} onChange={e=>setSettings(p=>({...p,timezone:e.target.value}))} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px",fontSize:11,outline:"none",color:C.mid,background:"#fafafa"}}>
            {["America/New_York","America/Chicago","America/Denver","America/Los_Angeles"].map(tz=><option key={tz}>{tz}</option>)}
          </select>
        </SettingRow>
      </Section>

      <Section title="🌐 Preferences">
        <SettingRow label="Language">
          <select value={settings.language} onChange={e=>setSettings(p=>({...p,language:e.target.value}))} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px",fontSize:11,outline:"none",color:C.mid,background:"#fafafa"}}>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
          </select>
        </SettingRow>
      </Section>

      <div style={{display:"flex",gap:8}}>
        <Btn onClick={()=>addToast("Settings saved successfully","success")} style={{flex:1}}><Save size={12}/>Save All Settings</Btn>
        <Btn variant="danger" onClick={()=>addToast("Logged out","info")}><LogOut size={12}/>Log Out</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const bp=useBreakpoint();
  const isMobile=bp==="xs"||bp==="sm";
  const [collapsed,setCollapsed]=useState(false);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [activeNav,setActiveNav]=useState("dashboard");
  const [notifs,setNotifs]=useState(INIT.notifications);
  const [toasts,setToasts]=useState([]);
  const toastId=useRef(0);

  const unreadCount=notifs.filter(n=>!n.read).length;

  const addToast=useCallback((msg,type="info")=>{
    const id=++toastId.current;
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),2800);
  },[]);

  const handleNav=useCallback((id)=>{
    setActiveNav(id);
    if(id==="notifs"){
      // mark all as read after viewing
      setTimeout(()=>setNotifs(p=>p.map(n=>({...n,read:true}))),3000);
    }
  },[]);

  const pageTitle={
    dashboard:"Dashboard",schedule:"Schedule",routes:"Routes",
    installs:"Installations",employees:"Employees",inspect:"Inspections",
    docs:"Documents",reports:"Reports",notifs:"Notifications",settings:"Settings",
  };

  const renderView=()=>{
    const props={bp,addToast,onNav:handleNav};
    switch(activeNav){
      case "dashboard":  return <DashboardView {...props}/>;
      case "schedule":   return <ScheduleView {...props}/>;
      case "routes":     return <RoutesView {...props}/>;
      case "installs":   return <InstallsView {...props}/>;
      case "employees":  return <EmployeesView {...props}/>;
      case "inspect":    return <InspectionsView {...props}/>;
      case "docs":       return <DocumentsView {...props}/>;
      case "reports":    return <ReportsView {...props}/>;
      case "notifs":     return <NotificationsView notifs={notifs} setNotifs={setNotifs} addToast={addToast}/>;
      case "settings":   return <SettingsView addToast={addToast}/>;
      default:           return <DashboardView {...props}/>;
    }
  };

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif",background:C.bg}}>
      {!isMobile&&<Sidebar collapsed={collapsed} onToggle={()=>setCollapsed(p=>!p)} active={activeNav} onNav={handleNav} bp={bp} notifCount={unreadCount}/>}
      {isMobile&&<MobileDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} active={activeNav} onNav={handleNav} notifCount={unreadCount}/>}

      <main style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",paddingBottom:isMobile?60:0}}>
        {/* Topbar */}
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:isMobile?"10px 14px":"11px 20px",display:"flex",alignItems:"center",gap:10,flexShrink:0,position:"sticky",top:0,zIndex:40}}>
          {isMobile&&(
            <button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",color:C.mid}}><Menu size={20}/></button>
          )}
          <div>
            <div style={{fontSize:isMobile?14:16,fontWeight:700,color:C.dark}}>
              {activeNav==="dashboard"?"Good morning, John! 👋":pageTitle[activeNav]}
            </div>
            {!isMobile&&activeNav==="dashboard"&&<div style={{fontSize:11,color:C.faint}}>Here's what's happening today.</div>}
          </div>
          {!isMobile&&(
            <div style={{flex:1,maxWidth:260,marginLeft:16,position:"relative"}}>
              <Search size={13} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.faint}}/>
              <input placeholder="Search anything..." style={{width:"100%",paddingLeft:28,paddingRight:10,height:32,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,outline:"none",color:C.mid,background:"#f8fafc",boxSizing:"border-box"}}/>
            </div>
          )}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
            <div onClick={()=>handleNav("notifs")} style={{position:"relative",cursor:"pointer"}}>
              <Bell size={18} color={C.muted}/>
              {unreadCount>0&&<span style={{position:"absolute",top:-4,right:-4,background:C.red,color:"#fff",fontSize:8,fontWeight:700,borderRadius:10,padding:"1px 4px",minWidth:14,textAlign:"center"}}>{unreadCount}</span>}
            </div>
            {!isMobile&&(
              <div style={{display:"flex",alignItems:"center",gap:4,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 8px",fontSize:12,color:C.mid,cursor:"pointer"}}>🇺🇸 EN <ChevronDown size={11}/></div>
            )}
            <div onClick={()=>handleNav("settings")} style={{width:30,height:30,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>JD</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{padding:isMobile?"12px 12px":bp==="md"?"14px 16px":"16px 20px",flex:1}}>
          {renderView()}
        </div>
      </main>

      {isMobile&&<BottomNav active={activeNav} onNav={handleNav} notifCount={unreadCount}/>}
      <Toast toasts={toasts}/>
    </div>
  );
}
