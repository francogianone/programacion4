import Swal from 'sweetalert2';

/**
 * Instancia base de Swal con el design system del proyecto.
 * Todas las alertas del proyecto deben usar esta instancia.
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'swal-toast-popup',
  },
});

/* ─── Notificaciones tipo toast ──────────────────────── */

export const toastSuccess = (text) =>
  Toast.fire({ icon: 'success', title: text });

export const toastError = (text) =>
  Toast.fire({ icon: 'error', title: text });

export const toastInfo = (text) =>
  Toast.fire({ icon: 'info', title: text });

/* ─── Confirmación destructiva ───────────────────────── */

/**
 * Diálogo de confirmación. Devuelve true si el usuario confirma.
 * @param {string} title  - título principal
 * @param {string} text   - subtexto (opcional)
 * @param {string} confirmText - texto del botón confirmar
 */
export const confirmDialog = async (
  title,
  text = '',
  confirmText = 'Confirmar'
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#1a1a1a',
    cancelButtonColor: '#e4e0da',
    reverseButtons: true,
    customClass: {
      cancelButton: 'swal-cancel-btn',
    },
    focusCancel: true,
  });
  return result.isConfirmed;
};

/* ─── Alerta de error simple ─────────────────────────── */

export const errorAlert = (title, text = '') =>
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#1a1a1a',
  });
