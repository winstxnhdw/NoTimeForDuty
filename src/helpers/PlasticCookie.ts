export default class PlasticCookie {
  static epochalypse_date = new Date(2147483647000).toUTCString()

  static get(name: string) {
    const cookie_value = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
    if (!cookie_value) return null

    return cookie_value.split('=')[1]
  }

  static set(name: string, value: string) {
    document.cookie = `${name}=${value}; expires=${this.epochalypse_date}`
  }
}
