const epochalypse_date = new Date(2147483647000).toUTCString()

export const set = (name: string, value: string) => {
  document.cookie = `${name}=${value}; expires=${epochalypse_date}`
}
