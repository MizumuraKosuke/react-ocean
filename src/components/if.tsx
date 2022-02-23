import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  cond?: boolean
}

const IF = ({ cond, children }: Props) => {
  if (cond === false) {
    return null
  }
  return <>{children}</>
}

export default IF
