export const DEFAULT_CHART_ANIMATION = {
  enterClassName: 'chart-anim-enter-fade',
  hoverClassName: 'chart-anim-hover-brighten',
  roles: {
    point: {
      enterClassName: 'chart-anim-enter-pop',
      hoverClassName: 'chart-anim-hover-point'
    },
    pointHalo: {
      enterClassName: 'chart-anim-enter-pop',
      hoverClassName: 'chart-anim-hover-halo'
    },
    aspect: {
      enterClassName: 'chart-anim-enter-fade',
      hoverClassName: 'chart-anim-hover-aspect'
    }
  }
}

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

/**
 * Builds SVG animation props for semantic chart roles.
 * Pass a custom animation object to NatalChartRenderer to swap classes or
 * durations without changing individual render layers.
 */
export function getAnimationProps(animation, role, extraClassName) {
  const config = {
    ...DEFAULT_CHART_ANIMATION,
    ...animation,
    roles: {
      ...DEFAULT_CHART_ANIMATION.roles,
      ...(animation?.roles || {})
    }
  }

  const roleConfig = config.roles[role] || {}

  return {
    className: joinClassNames(
      config.enterClassName,
      config.hoverClassName,
      roleConfig.enterClassName,
      roleConfig.hoverClassName,
      extraClassName
    ),
    style: {
      '--chart-enter-duration': roleConfig.enterDuration || config.enterDuration || '220ms',
      '--chart-hover-duration': roleConfig.hoverDuration || config.hoverDuration || '160ms'
    }
  }
}
