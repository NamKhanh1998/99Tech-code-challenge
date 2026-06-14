import { ThemeType } from '@/config'
import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
