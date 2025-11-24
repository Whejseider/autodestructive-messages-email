export function isValidEmail(email: string): boolean {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.trim());
}

export function sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

export function isValidMessageId(id: string): boolean {
    return id.trim().length > 0;
}

export function isValidMessageTitle(title: string): boolean {
    return title.trim().length > 0;
}