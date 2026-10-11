(()=>{
  const transferLinks=[...document.querySelectorAll('.transfer-nav a')];
  transferLinks.find(a=>a.getAttribute('href')?.includes('dump-upload'))?.remove();
  const downloadLink=transferLinks.find(a=>a.getAttribute('href')?.includes('par-download'));
  if(downloadLink)downloadLink.querySelector('.nav-text').textContent='File Download';

  const actions=document.querySelector('.actions'),message=document.createElement('div');
  message.id='formMessage';message.className='form-message';message.setAttribute('role','alert');message.setAttribute('aria-live','assertive');actions.before(message);
  window.alert=text=>{message.textContent=text;message.classList.add('show');message.scrollIntoView({block:'nearest'})};
  const fields=document.getElementById('fields');
  function clearFieldError(control){
    const field=control?.closest('.field');
    if(!field)return;
    field.classList.remove('field-invalid');
    control.removeAttribute('aria-invalid');
    control.removeAttribute('aria-describedby');
    field.querySelector('.field-error')?.remove();
  }
  function flagField(id,text){
    const control=document.getElementById(id),field=control?.closest('.field');
    if(!control||!field)return false;
    clearFieldError(control);
    const error=document.createElement('div');
    error.className='field-error';error.id=`${id}-error`;error.textContent=text;
    field.append(error);field.classList.add('field-invalid');
    control.setAttribute('aria-invalid','true');control.setAttribute('aria-describedby',error.id);
    return true;
  }
  function validateInputs(){
    fields.querySelectorAll('.field-invalid input,.field-invalid textarea,.field-invalid select').forEach(clearFieldError);
    message.classList.remove('show');
    const rules={
      bastion:[['ssh','Enter the OCI Bastion SSH command.'],['key','Enter the local private key path.'],['localPort','Enter a local port.']],
      createPar:[['namespace','Enter the Object Storage namespace.'],['bucket','Enter the bucket name.'],['parName','Enter a name for the PAR.'],['expires','Enter the UTC expiry date and time.']],
      dbmsCredential:[['credential','Enter a credential name.'],['ociUser','Enter the OCI username.'],['authToken','Enter the authentication-token placeholder.']],
      bucketDbms:[['credential','Enter a DBMS_CLOUD credential.'],['directory','Enter an Oracle directory.'],['uri','Enter the Object Storage URI.'],['dump','Enter the file name.']],
      exportDump:[['service','Enter the ADB service.'],['admin','Enter the administrator user.'],['password','Enter the password placeholder.'],['credential','Enter a DBMS_CLOUD credential.'],['directory','Enter an Oracle directory.'],['parallel','Enter the parallel value.'],['uri','Enter the Object Storage URI.'],['dump','Enter the dump file name.'],['schemaUser','Enter the user/schema name.']],
      importDump:[['service','Enter the ADB service.'],['admin','Enter the administrator user.'],['password','Enter the password placeholder.'],['credential','Enter a DBMS_CLOUD credential.'],['directory','Enter an Oracle directory.'],['parallel','Enter the parallel value.'],['uri','Enter the Object Storage URI.'],['dump','Enter the dump file name.'],['schemaUser','Enter the user/schema name.']],
      createUser:[['dbuser','Enter the user/schema name.'],['userpwd','Enter the password placeholder.'],['profile','Enter the profile.'],['tablespace','Enter the default tablespace.'],['temp','Enter the temporary tablespace.'],['quota','Enter the quota.']],
      pgCreateUser:[['pghost','Enter the PostgreSQL host.'],['pgport','Enter the port.'],['pgdb','Enter the database.'],['pgadmin','Enter the administrator.'],['pguser','Enter the role/schema name.'],['pgpwd','Enter the password placeholder.']],
      pgExport:[['pghost','Enter the PostgreSQL host.'],['pgport','Enter the port.'],['pgdb','Enter the database.'],['pgadmin','Enter the administrator.'],['pguser','Enter the role/schema name.'],['pgfile','Enter the output archive path.']],
      pgImport:[['pghost','Enter the PostgreSQL host.'],['pgport','Enter the port.'],['pgdb','Enter the database.'],['pgadmin','Enter the administrator.'],['pguser','Enter the target role/schema name.'],['pgfile','Enter the input archive path.']],
      pgOwnership:[['pghost','Enter the PostgreSQL host.'],['pgport','Enter the port.'],['pgdb','Enter the database.'],['pgadmin','Enter the administrator.'],['pguser','Enter the target role/schema name.']]
    };
    const errors=[];
    (rules[active]||[]).forEach(([id,text])=>{if(!document.getElementById(id)?.value.trim())errors.push([id,text])});
    const oracleIds={dbmsCredential:['credential'],bucketDbms:['credential','directory'],exportDump:['credential','directory','schemaUser'],importDump:['credential','directory','schemaUser'],createUser:['dbuser','profile','tablespace','temp']};
    (oracleIds[active]||[]).forEach(id=>{const value=document.getElementById(id)?.value.trim();if(value&&!/^[A-Za-z][A-Za-z0-9_$#]*$/.test(value))errors.push([id,'Use letters, numbers, _, $, or #; start with a letter.'])});
    if(active.startsWith('pg')){const value=document.getElementById('pguser')?.value.trim();if(value&&!/^[a-z_][a-z0-9_$]*$/.test(value))errors.push(['pguser','Use lowercase letters, numbers, _, or $; start with a letter or _.'])}
    if(active==='createPar'&&document.getElementById('accessType')?.value.startsWith('Object')&&!document.getElementById('objectName')?.value.trim())errors.push(['objectName','Enter an object name for object-level access.']);
    const port=document.getElementById(active==='bastion'?'localPort':'pgport');
    if(port?.value&&(+port.value<1||+port.value>65535))errors.push([port.id,'Enter a port from 1 to 65535.']);
    const seen=new Set();errors.forEach(([id,text])=>{if(!seen.has(id)){flagField(id,text);seen.add(id)}});
    if(!errors.length)return true;
    const first=document.getElementById(errors[0][0]);first?.focus();first?.scrollIntoView({block:'center',behavior:'smooth'});return false;
  }
  fields.addEventListener('input',e=>{message.classList.remove('show');clearFieldError(e.target)});
  fields.addEventListener('change',e=>clearFieldError(e.target));
  const generateButton=document.getElementById('generate'),originalGenerate=generateButton.onclick;
  generateButton.onclick=e=>{if(!validateInputs())return;originalGenerate?.call(generateButton,e)};

  const tools=document.querySelector('.favorite-tools'),select=document.getElementById('favoriteSelect');
  if(!tools||!select)return;
  document.getElementById('loadFavorite')?.remove();
  document.getElementById('deleteFavorite')?.remove();
  const settingsButton=document.createElement('button');settingsButton.id='manageFavorites';settingsButton.type='button';settingsButton.textContent='Settings';
  tools.insertBefore(settingsButton,tools.querySelector('.storage-note'));

  const dialog=document.createElement('dialog');dialog.className='favorites-dialog';dialog.innerHTML=`<div class="favorites-dialog-shell"><div class="favorites-dialog-head"><strong id="favoritesDialogTitle">Save favorite</strong><button type="button" id="closeFavoritesDialog">Close</button></div><div id="saveFavoritePanel" class="favorites-dialog-body"><label for="favoriteNameDialog">Favorite name</label><input id="favoriteNameDialog" autocomplete="off" maxlength="80"><div class="dialog-actions"><button type="button" id="confirmSaveFavorite" class="primary">Save</button><button type="button" id="cancelSaveFavorite">Cancel</button></div></div><div id="manageFavoritesPanel" class="favorites-dialog-body hidden"><p class="manager-hint">Rename or delete favorites stored in this browser.</p><div id="favoritesList"></div></div></div>`;
  document.body.append(dialog);
  const title=document.getElementById('favoritesDialogTitle'),savePanel=document.getElementById('saveFavoritePanel'),managePanel=document.getElementById('manageFavoritesPanel'),nameInput=document.getElementById('favoriteNameDialog');
  const closeDialog=()=>dialog.close();
  document.getElementById('closeFavoritesDialog').onclick=closeDialog;
  document.getElementById('cancelSaveFavorite').onclick=closeDialog;
  dialog.onclick=e=>{if(e.target===dialog)closeDialog()};

  async function allFavorites(){try{return await dbAction('favorites','readonly',s=>s.getAll())}catch{alert('This browser could not read saved favorites.');return[]}}
  async function saveNamedFavorite(){const favoriteName=nameInput.value.trim();if(!favoriteName){nameInput.focus();return}try{const rows=await allFavorites(),existing=rows.find(x=>x.caseId===active&&x.name.toLowerCase()===favoriteName.toLowerCase()),id=existing?.id||crypto.randomUUID();await dbAction('favorites','readwrite',s=>s.put({id,caseId:active,name:favoriteName,values:capturedValues(),updatedAt:Date.now()}));await refreshFavorites();select.value=id;closeDialog()}catch{alert('This browser could not save the favorite.')}}
  document.getElementById('saveFavorite').onclick=()=>{title.textContent='Save favorite';savePanel.classList.remove('hidden');managePanel.classList.add('hidden');nameInput.value='';dialog.showModal();nameInput.focus()};
  document.getElementById('confirmSaveFavorite').onclick=saveNamedFavorite;
  nameInput.onkeydown=e=>{if(e.key==='Enter')saveNamedFavorite()};

  select.onchange=async()=>{const id=select.value;if(!id)return;try{const favorite=await dbAction('favorites','readonly',s=>s.get(id));if(favorite?.caseId===active){applyValues(favorite.values);saveDraft(active);message.classList.remove('show')}}catch{alert('This browser could not load the favorite.')}};

  async function renderManager(){const list=document.getElementById('favoritesList'),caseName=cases.find(c=>c[0]===active)?.[1]||active,rows=(await allFavorites()).filter(row=>row.caseId===active).sort((a,b)=>a.name.localeCompare(b.name));list.replaceChildren();if(!rows.length){const empty=document.createElement('p');empty.className='manager-empty';empty.textContent=`No favorites saved for ${caseName}.`;list.append(empty);return}rows.forEach(row=>{const item=document.createElement('div');item.className='favorite-item';const input=document.createElement('input');input.value=row.name;input.maxLength=80;input.setAttribute('aria-label','Favorite name');const rename=document.createElement('button');rename.type='button';rename.textContent='Rename';rename.onclick=async()=>{const newName=input.value.trim();if(!newName){input.focus();return}await dbAction('favorites','readwrite',s=>s.put({...row,name:newName,updatedAt:Date.now()}));await refreshFavorites();renderManager()};const remove=document.createElement('button');remove.type='button';remove.className='danger';remove.textContent='Delete';remove.onclick=async()=>{await dbAction('favorites','readwrite',s=>s.delete(row.id));await refreshFavorites();renderManager()};item.append(input,rename,remove);list.append(item)})}
  settingsButton.onclick=async()=>{const caseName=cases.find(c=>c[0]===active)?.[1]||active;title.textContent=`Manage favorites · ${caseName}`;savePanel.classList.add('hidden');managePanel.classList.remove('hidden');dialog.showModal();await renderManager()};

  document.getElementById('reset').onclick=async()=>{const caseId=active;try{await dbAction('drafts','readwrite',s=>s.delete(caseId))}catch{}all='';message.classList.remove('show');draw();document.getElementById('resultsDialog').close()};
})();
