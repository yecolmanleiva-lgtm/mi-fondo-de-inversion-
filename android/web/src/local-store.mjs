import {defaults,mutate} from '../functions/domain.mjs';
export function localDefaults(){const p=defaults();return {...p,settings:{...p.settings,day:7,time:'08:00'}};}
const DB='mi-fondo-personal';
const STORE='portfolio';
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(new Error('No se pudo abrir el almacenamiento del teléfono. Comprueba que el dispositivo tenga espacio disponible.'));});}
// IndexedDB read/write transactions serialize changes across tabs. No simulated
// backend and no network queue: local data is explicitly local to this device.
export async function readLocal(){
  const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);let value;const r=store.get('current');r.onsuccess=()=>{value=r.result??localDefaults();if(!r.result)store.put(value,'current');};tx.oncomplete=()=>{db.close();resolve(value);};tx.onerror=()=>{db.close();reject(tx.error);};});
}
export async function changeLocal(op,data,revision){
  const db=await open();return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE);let result,error;
    const r=store.get('current');r.onsuccess=()=>{try{const p=r.result??localDefaults();if(p.revision!==revision)throw new Error('Los datos cambiaron en otra ventana. Vuelve a intentar con la información actualizada.');result=mutate(p,op,data);if(result.settings.enabled)result.settings.enabled=false;store.put(result,'current');}catch(e){error=e;tx.abort();}};
    tx.oncomplete=()=>{db.close();if(typeof window!=='undefined'){window.dispatchEvent(new Event('local-data-changed'));localStorage.setItem('mi-fondo-revision',String(result.revision));}resolve(result);};
    tx.onabort=()=>{db.close();reject(error??new Error('No se pudo guardar. Comprueba el espacio disponible en el teléfono.'));};tx.onerror=()=>{error=tx.error;};
  });
}
