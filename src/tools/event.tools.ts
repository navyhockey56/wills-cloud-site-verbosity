export const isPlainLeftClick = (event : MouseEvent) : boolean => {
  return !event.ctrlKey && event.button === 0
}

export const isEnterKeyPress = (event : KeyboardEvent) : boolean => {
  return event.key === 'Enter';
}
