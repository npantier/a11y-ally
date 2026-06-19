interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

export function IconButton({ label, onClick, children }: IconButtonProps) {
  return (
    <button type="button" className="aa-icon-btn" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}
