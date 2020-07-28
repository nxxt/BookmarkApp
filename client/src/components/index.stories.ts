// import { storiesOf } from '@storybook/vue'
import XTooltipBtn from './atoms/XTooltipBtn.vue'
import XTooltipChip from './atoms/XTooltipChip.vue'

export default {
  title: 'Components'
}

/* storiesOf('TooltipBtn', module).add('default', () => {
  const text = 'Button'
  return {
    components: { TooltipBtn },
    template: `<tooltip-btn>${text}</v-tooltip-btn>`
  }
}) */

export const TooltipBtn = () => ({
  components: { XTooltipBtn },
  template: '<x-tooltip-btn>Button</x-tooltip-btn>'
})

export const TooltipChip = () => ({
  components: { XTooltipChip },
  template: '<x-tooltip-chip>#</x-tooltip-chip>'
})
