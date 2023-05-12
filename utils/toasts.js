import { toast } from 'react-toastify'

export function showInfoToast(msg, time) {
    toast.info(msg, {
        position: 'top-center',
        autoClose: time,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    })
}