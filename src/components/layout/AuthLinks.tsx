import Link from "next/link"

export function AuthLinks() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        style={{
          width: '90px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--color-primary, #D4A44A)',
          borderRadius: '0.5rem',
          color: 'var(--color-primary, #D4A44A)',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-primary)'
          e.currentTarget.style.color = '#081527'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--color-primary, #D4A44A)'
        }}
      >
        Login
      </Link>
    </div>
  )
}
