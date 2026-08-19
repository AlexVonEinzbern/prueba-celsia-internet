export interface ItemNavegacion {
  id: string
  label: string
}

export interface SidebarProps {
  items: readonly ItemNavegacion[]
  activo: string
  onSeleccionar: (id: string) => void
}

export function Sidebar({ items, activo, onSeleccionar }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Navegación principal">
      {items.map((item) => {
        const esActivo = item.id === activo
        return (
          <button
            key={item.id}
            type="button"
            className={esActivo ? 'sidebar__item sidebar__item--activo' : 'sidebar__item'}
            aria-current={esActivo ? 'page' : undefined}
            onClick={() => onSeleccionar(item.id)}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
