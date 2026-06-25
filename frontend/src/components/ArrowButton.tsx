interface ArrowButtonProps {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  type?: 'submit' | 'button';
  onClick?: () => void;
  disabled?: boolean;
  direction?: 'right' | 'refresh';
  variant?: 'solid' | 'ghost';
}

// The app's recurring primary-action button: a short label paired with a
// circular icon. Used anywhere there's one clear "go" action — logging in,
// registering, opening the map, syncing with Strava — so the same gesture
// means the same thing everywhere in the app.
export default function ArrowButton({
  label,
  loading = false,
  loadingLabel,
  type = 'button',
  onClick,
  disabled = false,
  direction = 'right',
  variant = 'solid',
}: ArrowButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC4C02]/50 rounded-full"
    >
      <span
        className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
          variant === 'solid' ? 'text-white' : 'text-[#9CA3AF] group-hover:text-white'
        }`}
      >
        {loading && loadingLabel ? loadingLabel : label}
      </span>
      <span
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
          variant === 'solid'
            ? 'bg-[#FC4C02] group-hover:bg-[#e04400] text-white'
            : 'bg-white/5 border border-[#2D3142] group-hover:border-[#FC4C02] text-[#9CA3AF] group-hover:text-white'
        }`}
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : direction === 'refresh' ? (
          <span className="text-base leading-none">↻</span>
        ) : (
          <span className="text-base leading-none">→</span>
        )}
      </span>
    </button>
  );
}