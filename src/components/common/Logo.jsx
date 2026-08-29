const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN453N6mpAhn09UKYb6yIXeJS43lFNZ41j7YQtRNGHgbZONCxXKd-xog&s=10";

function Logo({ size = 'md', showText = true }) {
  const badgeSize = size === 'lg' ? 56 : size === 'sm' ? 30 : 38;
  const textSize = size === 'lg' ? '1.4rem' : size === 'sm' ? '0.95rem' : '1.15rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src={logoUrl}
        alt="Logo Leñas y Sabores"
        style={{
          width: badgeSize,
          height: badgeSize,
          objectFit: 'contain',
        }}
      />

      {showText && (
        <span
          className="font-display"
          style={{
            fontSize: textSize,
            fontWeight: 700,
            lineHeight: 1,
            color: 'var(--ink)',
          }}
        >
          Leñas &amp; Sabores
        </span>
      )}
    </div>
  );
}

export default Logo;