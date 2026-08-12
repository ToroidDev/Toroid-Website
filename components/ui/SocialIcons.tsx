interface IconProps {
  size?: number;
  className?: string;
}

// lucide-react v1 removeu os ícones de marca (LinkedIn/Instagram/YouTube).
// Glifos próprios em vez de uma lib extra, mesmo precedente do svg do
// WhatsAppButton. Um único traço, currentColor, para funcionar tanto sobre
// fundo claro (Footer) quanto sobre azul (página /contato).
export function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" />
      <circle cx="7.2" cy="8" r="1.1" fill="currentColor" stroke="none" />
      <path d="M7.2 11v6.5M11.3 17.5v-4c0-1.7.9-2.6 2.2-2.6 1.3 0 2.1.9 2.1 2.6v4" />
    </svg>
  );
}

export function InstagramIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      className={className}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsappIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.6-1.49-1.9-.15-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.06 4.37 2.47.97 2.98.78 3.52.73.54-.05 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2.5c-5.23 0-9.48 4.24-9.48 9.47 0 1.67.44 3.3 1.27 4.74L2.5 21.5l4.92-1.29a9.46 9.46 0 0 0 4.62 1.19c5.23 0 9.48-4.25 9.48-9.48 0-5.23-4.25-9.42-9.48-9.42Zm0 17.34c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.02.79.8-2.95-.2-.31a7.86 7.86 0 0 1-1.2-4.16c0-4.34 3.53-7.87 7.88-7.87a7.83 7.83 0 0 1 7.87 7.88c0 4.34-3.53 7.96-7.58 7.96Z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      className={className}
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.3 8.7v6.6l5.7-3.3-5.7-3.3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
