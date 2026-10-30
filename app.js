(()=>{
  "use strict";
  const gallery = [
    ["01-painel.png","01 — Painel de gestão","Indicadores e alertas apresentados em uma visão consolidada.","Painel demonstrativo com indicadores e alertas fictícios"],
    ["02-escolas.png","02 — Cadastro de escolas","Organização de escolas e seus registros fictícios.","Cadastro de escolas demonstrativas com dados fictícios"],
    ["03-produtos.png","03 — Cadastro de produtos","Produtos e unidades de estoque ilustrativos.","Produtos fictícios cadastrados no NUTRIAQUA de demonstração"],
    ["04-estoque.png","04 — Controle de estoque","Lotes, saldos e datas de validade no ambiente de demonstração.","Tabela de estoque demonstrativa com lotes e saldos"],
    ["05-cardapio.png","05 — Programação de cardápios","Fluxo de programação por escola, modalidade e refeição.","Tela de programação de cardápio em ambiente demonstrativo"],
    ["06-guia.png","06 — Guia de separação","Exemplo de documento gerado a partir de uma requisição demonstrativa.","Guia de separação ilustrativa com dados fictícios"]
  ];
  const $=id=>document.getElementById(id);
  const img=$('gallery-main-image'), link=$('gallery-open');
  const thumbs=[...document.querySelectorAll('.thumb')];
  const dialog=$('image-dialog'), modalImage=$('dialog-image');
  const viewport=document.querySelector('.dialog-viewport');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let selected=0, pending=0;
  function syncDialog(){
    const item=gallery[selected];
    modalImage.src='assets/screenshots/'+item[0]; modalImage.alt=item[3];
    $('dialog-title').textContent=item[1];
    $('dialog-count').textContent=String(selected+1)+' / 6';
    viewport.classList.remove('zoomed');
    $('dialog-zoom').setAttribute('aria-pressed','false');
    $('dialog-zoom').textContent='Tamanho original';
    viewport.scrollTo(0,0);
  }
  async function selectGallery(i){
    const item=gallery[i]; if(!item) return;
    const ticket=++pending;
    const src='assets/screenshots/'+item[0];
    const preload=new Image(); preload.src=src;
    try{await preload.decode();}catch{return;}
    if(ticket!==pending) return;
    selected=i; img.src=src; img.alt=item[3]; link.href=src;
    $('gallery-label').textContent=item[1]; $('gallery-description').textContent=item[2];
    $('gallery-index').textContent=String(i+1).padStart(2,'0');
    thumbs.forEach((button,j)=>{button.classList.toggle('active',j===i);button.setAttribute('aria-pressed',String(j===i));});
    img.classList.remove('swap-enter');
    if(!reduce.matches){void img.offsetWidth;img.classList.add('swap-enter');}
    if(dialog.open) syncDialog();
  }
  thumbs.forEach((button,i)=>{
    button.addEventListener('click',()=>selectGallery(i));
    button.addEventListener('keydown',event=>{
      const next=event.key==='ArrowRight'?(i+1)%6:event.key==='ArrowLeft'?(i+5)%6:event.key==='Home'?0:event.key==='End'?5:null;
      if(next===null)return;event.preventDefault();thumbs[next].focus();selectGallery(next);
    });
  });
  link.addEventListener('click',event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||typeof dialog.showModal!=='function')return;
    event.preventDefault();syncDialog();dialog.showModal();
  });
  $('dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const items=[...dialog.querySelectorAll('button,[tabindex="0"]')];
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('close',()=>{viewport.classList.remove('zoomed');link.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  $('dialog-prev').addEventListener('click',()=>selectGallery((selected+5)%6));
  $('dialog-next').addEventListener('click',()=>selectGallery((selected+1)%6));
  $('dialog-zoom').addEventListener('click',()=>{
    const zoom=viewport.classList.toggle('zoomed');
    $('dialog-zoom').setAttribute('aria-pressed',String(zoom));
    $('dialog-zoom').textContent=zoom?'Ajustar à tela':'Tamanho original';
    viewport.scrollTo(0,0);
  });
  const menu=$('mobile-menu'),nav=$('main-nav');
  function closeMenu(restore=false){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('open');if(restore)menu.focus();}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu(true);});
  document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menu.contains(event.target))closeMenu();});
  document.addEventListener('focusin',event=>{if(!nav.contains(event.target)&&event.target!==menu)closeMenu();});
  matchMedia('(min-width:901px)').addEventListener('change',()=>closeMenu());
})();
