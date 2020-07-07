import { defineComponent, InjectionKey, Transition } from 'vue'
import { ElPopper } from '../Popper'
import { useMenu } from './Menu'
import CollapseTransition from '../Transition/CollapseTransition'

type SubMenuState = {
  deep: number
  items: symbol[]
}

export type SubMenuInjectData = {
  subMenuState: SubMenuState
  subMenuActions: {
    add: (id: symbol) => void
    remove: (id: symbol) => void
  }
}
export const SubMenuSymbol: InjectionKey<SubMenuInjectData> = Symbol('Submenu')

export default defineComponent({
  name: 'ElSubmenu',
  props: {
    disabled: { type: Boolean, default: false },
    popperClass: { type: String, default: '' }
  },
  setup(props, { slots, attrs, emit }) {
    const id = Symbol(`ElSubmenu`)
    const { data, config, actions } = useMenu({ id })

    const handleClick = () => {
      // if (
      //   (config?.trigger === 'hover' && config?.mode === 'horizontal') ||
      //   (config?.collapse && config?.mode === 'vertical') ||
      //   props.disabled
      // ) {
      //   return
      // }
      if (data.isOpen) {
        actions?.toggleOpen(false)
      } else {
        actions?.toggleOpen(true)
      }
    }

    // const onMouseEnter = () => {
    //   if (
    //     (config?.trigger === 'click' && config?.mode === 'horizontal') ||
    //     (!config?.collapse && config?.mode === 'vertical') ||
    //     props.disabled
    //   ) {
    //     return
    //   }
    //   actions?.toggleOpen(true)
    // }
    // const onMouseLeave = () => {
    //   if (
    //     (config?.trigger === 'click' && config?.mode === 'horizontal') ||
    //     (!config?.collapse && config?.mode === 'vertical')
    //   ) {
    //     return
    //   }
    //   actions?.toggleOpen(false)
    // }

    const handleTitleMouseenter = () => {
      if (config?.mode === 'horizontal' && !config?.backgroundColor) return
      // submenuTitleRef.value && (submenuTitleRef.value.style.backgroundColor = root?.hoverBackground);
    }
    const handleTitleMouseleave = () => {
      if (config?.mode === 'horizontal' && !config?.backgroundColor) return
      // referenceRef.value && (referenceRef.value.style.backgroundColor = menuState.backgroundColor || '')
    }

    return () => {
      const Title = (
        <div
          class="el-submenu__title"
          // style={state.style}
          onClick={handleClick}
          onMouseenter={handleTitleMouseenter}
          onMouseleave={handleTitleMouseleave}
        >
          {slots.title?.()}
          <i class={['el-submenu__icon-arrow', 'el-icon-arrow-down']}></i>
        </div>
      )
      return config?.isPopup ? (
        <li
          class={{
            'el-submenu': true,
            'is-active': data.isActive,
            'is-opened': data.isOpen,
            'is-disabled': props.disabled
          }}
          role="menuitem"
        >
          <ElPopper
            placement={data.deep === 0 ? 'bottom-start' : 'right-start'}
            render={() => (
              <ul
                role="menu"
                class={[
                  'el-menu',
                  'el-menu--popup',
                  `el-menu--popup-${data.deep === 0 ? 'bottom-start' : 'right-start'}`
                ]}
                style={{ backgroundColor: config?.backgroundColor, width: '200px' }}
              >
                {slots.default?.()}
              </ul>
            )}
          >
            {Title}
          </ElPopper>
        </li>
      ) : (
        <li
          class={{
            'el-submenu': true,
            'is-active': data.isActive,
            'is-opened': data.isOpen,
            'is-disabled': props.disabled
          }}
          role="menuitem"
        >
          {Title}
          <CollapseTransition>
            {data.isOpen && (
              <ul role="menu" class="el-menu el-menu--inline" style={{ backgroundColor: config?.backgroundColor }}>
                {slots.default?.()}
              </ul>
            )}
          </CollapseTransition>
        </li>
      )
    }
  }
})
