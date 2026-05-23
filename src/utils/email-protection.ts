/**
 * Codifica email para proteção contra robôs de spam
 */
export function encodeEmail(email: string): string {
  return email
    .split('')
    .map(char => `&#${char.charCodeAt(0)};`)
    .join('');
}

/**
 * Decodifica email codificado
 */
export function decodeEmail(encodedEmail: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedEmail;
  return textarea.value;
}

/**
 * Retorna email do contato protegido
 */
export function getProtectedContactEmail(): string {
  // eclebermonteiro26@gmail.com codificado
  return '&#101;&#99;&#108;&#101;&#98;&#101;&#114;&#109;&#111;&#110;&#116;&#101;&#105;&#114;&#111;&#50;&#54;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;';
}

/**
 * Gera link de email protegido
 */
export function getProtectedMailtoLink(): string {
  return `mailto:${getProtectedContactEmail()}`;
}