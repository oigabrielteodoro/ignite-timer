import { useFormContext } from 'react-hook-form'

import { useCycles } from '../../../contexts/CyclesContext'

import {
  FormContainer,
  MinutesAmountInput,
  TaskInput,
} from './NewCycleForm.styles'

export function NewCycleForm() {
  const { activeCycle } = useCycles()
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        id="task"
        list="taskSuggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={Boolean(activeCycle)}
        {...register('task')}
      />

      <datalist id="taskSuggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
        <option value="Banana" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={Boolean(activeCycle)}
        {...register('minutesAmount', {
          valueAsNumber: true,
        })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
