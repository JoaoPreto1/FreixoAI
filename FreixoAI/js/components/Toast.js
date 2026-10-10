/**
 * FREIXO AI — Notificações Toast Flutuantes
 */

export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('freixo-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'freixo-toast-container';
    container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none px-4 max-w-md w-full';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgStyles = type === 'success' 
    ? 'bg-[#182E22] text-[#FAF8F5] border-[#2E543E]' 
    : type === 'warning' 
    ? 'bg-[#B65737] text-white border-[#8E3B21]' 
    : 'bg-[#24211D] text-[#FAF8F5] border-[#3D3830]';

  toast.className = `pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${bgStyles}`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-[#DFBA71]' : 'bg-[#B65737]'} animate-pulse"></span>
      <span>${message}</span>
    </div>
    <button class="opacity-70 hover:opacity-100 text-xs px-1 text-[#FAF8F5]" aria-label="Fechar">✕</button>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  const removeToast = () => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('button').addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
}
