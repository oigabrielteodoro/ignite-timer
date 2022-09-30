import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../../reducers/cycles/reducer'

type CreateNewCycleData = Pick<Cycle, 'task' | 'minutesAmount'>

type CyclesProviderProps = {
  children: ReactNode
}

type CyclesContextType = {
  cycles: Cycle[]
  activeCycle?: Cycle
  amountSecondsPast: number
  createNewCycle: (newCycleFormData: CreateNewCycleData) => void
  markCurrentCycleAsFinished: () => void
  interruptCurrentCycle: () => void
  setSecondsPast: (secondsPast: number) => void
}

const CyclesContext = createContext({} as CyclesContextType)

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (state) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return state
    },
  )

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPast, setAmountSecondsPast] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function createNewCycle({ task, minutesAmount }: CreateNewCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPast(0)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        amountSecondsPast,
        createNewCycle,
        markCurrentCycleAsFinished,
        interruptCurrentCycle,
        setSecondsPast: setAmountSecondsPast,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles() {
  const context = useContext(CyclesContext)

  return context
}
