export const add = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
