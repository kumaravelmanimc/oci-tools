(() => {
  const source = document.currentScript;
  const page = source?.dataset.page;
  if (!page || document.getElementById('appShell')) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = '../app-shell.css'; document.head.append(css);
  const active = name => page === name ? ' class="active"' : '';
  const header = document.createElement('header');
  header.className = 'appbar';
  header.innerHTML = '<button id="menuToggle" class="menu-toggle" aria-label="Toggle navigation" title="Toggle navigation">☰</button><div class="app-title">OCI Tools</div>';
  const shell = document.createElement('div');
  shell.id = 'appShell'; shell.className = 'app-shell';
  shell.innerHTML = `<aside class="app-sidebar">
    <section class="nav-group"><div class="nav-heading">Object Storage Transfers</div><nav class="app-nav">
      <a${active('file-uploads')} href="../file-uploads/"><span class="nav-icon">UP</span><span class="nav-text">File Upload</span></a>
      <a${active('par-download')} href="../par-download/"><span class="nav-icon">DL</span><span class="nav-text">File Download</span></a>
    </nav></section>
    <section class="nav-group"><div class="nav-heading">Script Generators</div><nav class="app-nav">
      <a href="../script-generator/?category=powershell"><span class="nav-icon">PS</span><span class="nav-text">PowerShell</span></a>
      <a href="../script-generator/?category=oracle"><span class="nav-icon">ORA</span><span class="nav-text">Oracle DB</span></a>
      <a href="../script-generator/?category=postgres"><span class="nav-icon">PG</span><span class="nav-text">PostgreSQL DB</span></a>
    </nav></section>
  </aside><div class="app-workspace"></div>`;

  document.querySelector('.top')?.remove();
  const content = document.querySelector('main');
  content.classList.add('transfer-page', `transfer-${page}`);
  content.before(header, shell);
  shell.querySelector('.app-workspace').append(content);

  const firstPanel = content.querySelector('.panel');
  if (firstPanel) {
    firstPanel.classList.add('transfer-primary');
    const title = firstPanel.querySelector(':scope > h1');
    const description = title?.nextElementSibling;
    let usecase = null;
    if (title && description?.tagName === 'P') {
      usecase = document.createElement('div'); usecase.className = 'transfer-usecase';
      usecase.innerHTML = '<div class="transfer-section-label">Use case</div>';
      const guide = document.createElement('div'); guide.className = 'transfer-guide';
      firstPanel.insertBefore(usecase, title); usecase.append(guide); guide.append(title, description);
    }
    const parameters = document.createElement('div'); parameters.className = 'transfer-parameters';
    const parameterTitle = document.createElement('div'); parameterTitle.className = 'transfer-parameter-title'; parameterTitle.textContent = 'Parameters';
    parameters.append(parameterTitle);
    [...firstPanel.childNodes].filter(node => node !== usecase && node !== parameters).forEach(node => parameters.append(node));
    firstPanel.append(parameters);

    const message = document.createElement('div');
    message.id = 'appMessage'; message.className = 'app-message'; message.setAttribute('role', 'alert'); message.setAttribute('aria-live', 'assertive');
    parameterTitle.after(message);
    window.alert = text => { message.textContent = text; message.classList.add('show'); message.scrollIntoView({ block: 'nearest' }); };
    firstPanel.addEventListener('input', () => message.classList.remove('show'));
  }

  const secondaryPanels = [...content.querySelectorAll('.panel:not(.transfer-primary)')];
  secondaryPanels.forEach(panel => panel.classList.add('transfer-secondary'));
  if (secondaryPanels.length === 1) secondaryPanels[0].classList.add('transfer-wide');

  if (page === 'file-uploads') {
    const parLabel = document.querySelector('label[for="par"]');
    const files = document.getElementById('files');
    if (parLabel && files) {
      const type = document.createElement('div');
      type.innerHTML = '<label style="margin-top:10px">Upload type</label><div class="upload-type"><label><input type="radio" name="uploadType" value="dump"> Oracle Data Pump files only</label><label><input type="radio" name="uploadType" value="any" checked> Any file type</label></div>';
      parLabel.before(type);
      if (new URLSearchParams(location.search).get('mode') === 'dump') type.querySelector('[value="dump"]').checked = true;
      const applyType = () => { files.accept = type.querySelector('[value="dump"]').checked ? '.dmp' : ''; };
      type.addEventListener('change', applyType); applyType();
      document.getElementById('start').addEventListener('click', event => {
        if (!type.querySelector('[value="dump"]').checked) return;
        if ([...files.files].some(file => !file.name.toLowerCase().endsWith('.dmp'))) {
          event.preventDefault(); event.stopImmediatePropagation();
          alert('Dump-only upload accepts files with the .dmp extension. Remove other files and try again.');
        }
      }, true);
    }
  }

  const toggle = document.getElementById('menuToggle');
  toggle.onclick = () => {
    if (matchMedia('(max-width:760px)').matches) {
      const expanded = shell.classList.toggle('mobile-expanded');
      toggle.setAttribute('aria-label', expanded ? 'Collapse navigation' : 'Expand navigation');
    } else {
      const collapsed = shell.classList.toggle('collapsed');
      toggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    }
  };
})();
