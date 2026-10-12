export const ZONE = 'America/Asuncion';
export const MAX_ENTRIES = 1000;
export function localParts(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(x=>[x.type,x.value]));
  return {date:`${p.year}-${p.month}-${p.day}`,month:`${p.year}-${p.month}`,time:`${p.hour}:${p.minute}`};
}
export function validDate(s) { return typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && s >= '2000-01-01' && s <= '2100-12-31' && new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s; }
export function validMonth(s) { return typeof s==='string' && /^20\d{2}-(0[1-9]|1[0-2])$/.test(s); }
export function dueDate(month, day) {const [y,m]=month.split('-').map(Number); return `${month}-${String(Math.min(day,new Date(Date.UTC(y,m,0)).getUTCDate())).padStart(2,'0')}`;}
export function shiftDate(date, days) {const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function nextMonth(month) {const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m,1)).toISOString().slice(0,7);}
export function monthsBetween(start,end) {const a=[];for(let m=start;m<=end && a.length<1200;m=nextMonth(m))a.push(m);return a;}
function assert(ok,message) {if(!ok)throw new Error(message);}
export function money(value,zero=false) {assert(Number.isSafeInteger(value)&&value>=(zero?0:1)&&value<=1e12,'Introduce un importe entero entre '+(zero?'0':'1')+' y 1.000.000.000.000 Gs.');return value;}
export function validateEntry(e,today=localParts().date) {
  assert(e&&typeof e==='object','Aporte inválido.');
  assert(typeof e.id==='string'&&/^[a-zA-Z0-9-]{8,80}$/.test(e.id),'Identificador inválido.');
  money(e.amount);assert(validDate(e.date)&&e.date<=today,'La fecha debe ser válida y no estar en el futuro.');
  assert(validMonth(e.period),'Mes de cumplimiento inválido.');
  assert(typeof e.note==='string'&&e.note.length<=200,'La observación admite hasta 200 caracteres.');
  return {id:e.id,amount:e.amount,date:e.date,period:e.period,note:e.note.trim()};
}
export function defaults(today=localParts().date) {return {version:1,revision:0,entries:[],settings:{fundName:'Mi fondo de inversión',monthly:500000,goal:5000000,day:10,time:'09:00',advance:1,pending:true,enabled:false,startMonth:today.slice(0,7),theme:'light',valuation:null,valuationDate:null},snooze:null};}
export function validateSettings(s) {
  assert(s&&typeof s==='object','Configuración inválida.');
  assert(typeof s.fundName==='string'&&s.fundName.trim().length>0&&s.fundName.length<=70,'El nombre admite entre 1 y 70 caracteres.');
  money(s.monthly);money(s.goal);assert(Number.isInteger(s.day)&&s.day>=1&&s.day<=31,'Día inválido.');
  assert(typeof s.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s.time),'Hora inválida.');
  assert([0,1,2,3,7].includes(s.advance),'Aviso anticipado inválido.');
  assert(typeof s.pending==='boolean'&&typeof s.enabled==='boolean','Preferencias inválidas.');
  assert(validMonth(s.startMonth),'Mes inicial inválido.');assert(['light','dark','system'].includes(s.theme),'Tema inválido.');
  if(s.valuation!==null){money(s.valuation,true);assert(validDate(s.valuationDate)&&s.valuationDate<=localParts().date,'Fecha de valoración inválida.');}
  return {fundName:s.fundName.trim(),monthly:s.monthly,goal:s.goal,day:s.day,time:s.time,advance:s.advance,pending:s.pending,enabled:s.enabled,startMonth:s.startMonth,theme:s.theme,valuation:s.valuation,valuationDate:s.valuation===null?null:s.valuationDate};
}
export function total(entries) {return entries.reduce((n,e)=>n+e.amount,0);}
export function periodTotal(entries,period) {return total(entries.filter(e=>e.period===period));}
export function complete(p,period) {return periodTotal(p.entries,period)>=p.settings.monthly;}
export function validateBackup(raw) {
  assert(raw?.version===1&&Array.isArray(raw.entries)&&raw.entries.length<=MAX_ENTRIES,'Respaldo inválido o supera 1.000 registros.');
  const entries=raw.entries.map(e=>validateEntry(e));
  assert(new Set(entries.map(e=>e.id)).size===entries.length,'El respaldo contiene identificadores duplicados.');
  return {entries,settings:validateSettings(raw.settings)};
}
export function mutate(p,op,data,today=localParts().date) {
  let entries=[...p.entries],settings=p.settings,snooze=p.snooze??null;
  if(op==='saveEntry') {
    const e=validateEntry(data,today),index=entries.findIndex(x=>x.id===e.id);
    assert(!entries.some(x=>x.id!==e.id&&x.amount===e.amount&&x.date===e.date&&x.period===e.period&&x.note===e.note),'Ya existe un aporte idéntico. Revísalo en el historial.');
    if(index>=0)entries[index]=e;else{assert(entries.length<MAX_ENTRIES,'Límite de 1.000 aportes alcanzado. Exporta tus datos y solicita una ampliación.');entries.push(e);}
  } else if(op==='deleteEntry') {assert(entries.some(x=>x.id===data.id),'El aporte ya no existe.');entries=entries.filter(x=>x.id!==data.id);}
  else if(op==='settings'){settings=validateSettings(data);snooze=null;}
  else if(op==='restore'){({entries,settings}=validateBackup(data));snooze=null;}
  else if(op==='snooze'){assert(validMonth(data.period),'Mes inválido.');snooze={period:data.period,until:Date.now()+24*60*60*1000};}
  else throw new Error('Operación desconocida.');
  return {version:1,revision:p.revision+1,entries,settings,snooze};
}
// Pure scheduling policy; each ID is stable across scheduler retries and settings edits.
export function reminderCandidates(p, now=new Date()) {
  const s=p.settings,l=localParts(now);if(!s.enabled)return [];
  if(p.snooze?.until>now.getTime())return [];
  const out=[];
  if(p.snooze&&p.snooze.until<=now.getTime()&&now.getTime()<p.snooze.until+86400000&&!complete(p,p.snooze.period))out.push({id:`snooze-${p.snooze.until}`,period:p.snooze.period,kind:'snooze'});
  if(l.time<s.time)return out;
  for(const month of [l.month,nextMonth(l.month)]) {
    if(month<s.startMonth||complete(p,month))continue;
    const due=dueDate(month,s.day);
    if(l.date===due)out.push({id:`${month}-due`,period:month,kind:'due'});
    if(s.advance&&l.date===shiftDate(due,-s.advance))out.push({id:`${month}-advance`,period:month,kind:'advance'});
  }
  if(s.pending){const overdue=monthsBetween(s.startMonth,l.month).find(m=>dueDate(m,s.day)<l.date&&!complete(p,m));if(overdue)out.push({id:`${overdue}-pending-${l.date}`,period:overdue,kind:'pending'});}
  return out.filter((c,i)=>out.findIndex(other=>other.period===c.period)===i);
}
