// A visible, keyboard-accessible confirmation inside the app. Native browser
// confirm dialogs behave inconsistently in installed and embedded web views.
export function askConfirmation(message:string):Promise<boolean>{
  return new Promise(resolve=>{
    const dialog=document.createElement('dialog');dialog.className='modal confirmation';
    const title=document.createElement('h2');title.id='confirm-'+crypto.randomUUID();title.textContent='Confirmar acción';dialog.setAttribute('aria-labelledby',title.id);
    const text=document.createElement('p');text.textContent=message;
    const actions=document.createElement('div');actions.className='modal-actions';
    const cancel=document.createElement('button');cancel.className='button secondary';cancel.textContent='Cancelar';
    const approve=document.createElement('button');approve.className='button primary';approve.textContent='Sí, continuar';
    const finish=(answer:boolean)=>{dialog.close();dialog.remove();resolve(answer);};
    cancel.onclick=()=>finish(false);approve.onclick=()=>finish(true);dialog.oncancel=e=>{e.preventDefault();finish(false);};
    actions.append(cancel,approve);dialog.append(title,text,actions);document.body.append(dialog);dialog.showModal();cancel.focus();
  });
}
