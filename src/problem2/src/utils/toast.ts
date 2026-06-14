import { toast } from 'react-toastify'

export function toastError(title: string, message: string) {
  toast.error(`${title}: ${message}`, {
    className: 'custom-toast',
    progressClassName: 'custom-toast-progress',
    icon: false,
  })
}
