import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

import './styles.css'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  id: string
  name?: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  allowEmpty?: boolean
  emptyLabel?: string
}

const EMPTY_VALUE = '__prisma_empty__'

export function Select({
  id,
  name,
  value,
  onValueChange,
  options,
  placeholder = 'Selecione uma opção',
  disabled = false,
  required = false,
  allowEmpty = false,
  emptyLabel = 'Nenhum',
}: SelectProps) {
  function handleValueChange(nextValue: string) {
    onValueChange(nextValue === EMPTY_VALUE ? '' : nextValue)
  }

  return (
    <SelectPrimitive.Root
      name={name}
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectPrimitive.Trigger
        id={id}
        className="prisma-select__trigger"
        aria-required={required}
      >
        <SelectPrimitive.Value placeholder={placeholder} />

        <SelectPrimitive.Icon className="prisma-select__icon">
          <ChevronDown size={16} aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="prisma-select__content"
          position="popper"
          sideOffset={6}
          collisionPadding={12}
        >
          <SelectPrimitive.ScrollUpButton className="prisma-select__scroll">
            <ChevronUp size={16} aria-hidden="true" />
          </SelectPrimitive.ScrollUpButton>

          <SelectPrimitive.Viewport className="prisma-select__viewport">
            {allowEmpty && (
              <SelectPrimitive.Item
                className="prisma-select__item"
                value={EMPTY_VALUE}
              >
                <SelectPrimitive.ItemText>
                  {emptyLabel}
                </SelectPrimitive.ItemText>

                <SelectPrimitive.ItemIndicator className="prisma-select__indicator">
                  <Check size={15} aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            )}

            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="prisma-select__item"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>

                <SelectPrimitive.ItemIndicator className="prisma-select__indicator">
                  <Check size={15} aria-hidden="true" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}

            {options.length === 0 && (
              <div className="prisma-select__empty">
                Nenhuma opção disponível
              </div>
            )}
          </SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton className="prisma-select__scroll">
            <ChevronDown size={16} aria-hidden="true" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}