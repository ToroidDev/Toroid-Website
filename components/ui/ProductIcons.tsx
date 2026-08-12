import type { ProdutoIcone } from "@/lib/produtos";

interface IconProps {
  size?: number;
  className?: string;
}

export function TcIcon({ size = 46, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="18" stroke="#1A4B8C" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="8" stroke="#1A4B8C" strokeWidth="1.4" />
      <path d="M24 6v10M24 32v10" stroke="#B8834A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ToroidalIcon({ size = 46, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="18" stroke="#1A4B8C" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="8" stroke="#1A4B8C" strokeWidth="1.4" />
      <path d="M9 18h30M9 30h30" stroke="#B8834A" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PotenciaIcon({ size = 46, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="18" stroke="#1A4B8C" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="8" stroke="#1A4B8C" strokeWidth="1.4" />
      <path
        d="M9 18h10L28 30h11"
        stroke="#B8834A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IndutorIcon({ size = 46, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M6 30h6" stroke="#1A4B8C" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M36 30h6" stroke="#1A4B8C" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 30a4 4 0 0 1 8 0M20 30a4 4 0 0 1 8 0M28 30a4 4 0 0 1 8 0"
        stroke="#B8834A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M10 16h28" stroke="#1A4B8C" strokeWidth="1.4" strokeLinecap="round" opacity=".4" />
    </svg>
  );
}

const ICONS: Record<ProdutoIcone, (props: IconProps) => React.JSX.Element> = {
  tc: TcIcon,
  toroidal: ToroidalIcon,
  indutor: IndutorIcon,
  potencia: PotenciaIcon,
};

export function ProdutoIconeSvg({
  icone,
  size,
  className,
}: {
  icone: ProdutoIcone;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[icone];
  return <Icon size={size} className={className} />;
}
