class Toast {
    showToast(message, error = false) {
        const toast = document.querySelector(".toast");

        toast.classList.remove("hidden");
        toast.textContent = message;

        if (error) {
            toast.classList.add("error")
        } else {
            toast.classList.remove("error");
        }

        setTimeout(() => {
            toast.classList.add("hidden");
            this.hidden = true;
        }, 3000);
    }
}

export default new Toast();