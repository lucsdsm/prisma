import {
  Monitor,
  Users,
  Building2,
  BriefcaseBusiness,
  Shapes,
  Tags,
  CircleCheck,
  History,
  type LucideIcon,
} from 'lucide-react'

export type SectionId =
  | 'equipamentos'
  | 'funcionarios'
  | 'setores'
  | 'cargos'
  | 'tipos'
  | 'propriedades'
  | 'status'
  | 'registros'

export interface NavigationItem {
  id: SectionId
  label: string
  description: string
  icon: LucideIcon
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Inventário',
    items: [
      {
        id: 'equipamentos',
        label: 'Equipamentos',
        description:
          'Consulte e gerencie os equipamentos, responsáveis e dados patrimoniais.',
        icon: Monitor,
      },
    ],
  },
  {
    label: 'Organização',
    items: [
      {
        id: 'funcionarios',
        label: 'Funcionários',
        description:
          'Gerencie os funcionários e seus vínculos com setores e cargos.',
        icon: Users,
      },
      {
        id: 'setores',
        label: 'Setores',
        description: 'Gerencie os setores da organização.',
        icon: Building2,
      },
      {
        id: 'cargos',
        label: 'Cargos',
        description: 'Gerencie os cargos dos funcionários.',
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: 'Configurações',
    items: [
      {
        id: 'tipos',
        label: 'Tipos de equipamento',
        description:
          'Gerencie as classificações dos equipamentos do inventário.',
        icon: Shapes,
      },
      {
        id: 'propriedades',
        label: 'Propriedades',
        description:
          'Gerencie as classificações de propriedade dos equipamentos.',
        icon: Tags,
      },
      {
        id: 'status',
        label: 'Status',
        description: 'Gerencie as situações dos equipamentos.',
        icon: CircleCheck,
      },
    ],
  },
  {
    label: 'Auditoria',
    items: [
      {
        id: 'registros',
        label: 'Registros de auditoria',
        description:
          'Consulte os registros de criação, alteração e exclusão.',
        icon: History,
      },
    ],
  },
]

export function getNavigationItem(id: SectionId): NavigationItem {
  for (const group of navigationGroups) {
    const item = group.items.find((item) => item.id === id)

    if (item) {
      return item
    }
  }

  throw new Error(`Seção não encontrada: ${id}`)
}