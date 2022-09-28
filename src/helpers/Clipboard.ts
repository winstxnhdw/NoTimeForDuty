export class Clipboard {
  static add(text: string) {
    navigator.clipboard.writeText(text)
  }
}
