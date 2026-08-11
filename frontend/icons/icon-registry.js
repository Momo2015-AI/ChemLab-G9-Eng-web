export const iconRegistry = {
  home: 'icons/home.svg',
  course: 'icons/course.svg',
  lab: 'icons/flask.svg',
  knowledge: 'icons/atom.svg',
  assessment: 'icons/chart.svg',
  ai: 'icons/robot.svg',
  settings: 'icons/settings.svg'
};

export function getIcon(name) {
  return iconRegistry[name] || iconRegistry.home;
}
