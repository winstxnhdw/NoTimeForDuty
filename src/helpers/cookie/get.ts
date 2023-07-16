export const get = (name: string) => {
  const cookie_value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  if (!cookie_value) return null

  return cookie_value.split('=')[1]
}
