export default function pad_zero_two(text: string | Number) {
  return String(text).padStart(2, '0')
}
