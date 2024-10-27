export function isValidLogin(login: string): boolean {
  const loginPattern = /^[a-zA-Z][a-zA-Z0-9_-]{3,19}$/;
  return loginPattern.test(login);
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function isValidPassword(password: string): boolean {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordPattern.test(password);
}

export function isExtensionFile(file: string): string {
  const regex = /(?:\.([^.]+))?$/;
  const result = regex.exec(file);
  return result?.[1] || "";
}
