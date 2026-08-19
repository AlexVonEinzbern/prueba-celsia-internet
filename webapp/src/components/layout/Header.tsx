export interface HeaderProps {
  titulo: string
}

export function Header({ titulo }: HeaderProps) {
  return (
    <header className="header">
      <span className="header__titulo">{titulo}</span>
    </header>
  )
}
