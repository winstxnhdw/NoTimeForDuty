const epochalypse_date = new Date(2147483647 * 1000).toUTCString()
const next_month = new Date().getMonth() + 2
const scrollbox = document.getElementById('scrollbox')
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let starting_text = $('#starting-text').val()
let text_to_copy = starting_text
let dates_sorted = ''

function get_cookie_value(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

function set_cookie_value(name, value) {
  document.cookie = `${name}=${value}; expires=${epochalypse_date}`
}

function on_date_change() {
  const selected_dates = $('.date').datepicker('getDates')
  const dates = {}
  const output_day_of_the_week = $('#day-of-the-week').is(':checked')

  selected_dates.forEach((selected_date) => {
    const date = selected_date.getDate()
    const month = selected_date.getMonth() + 1
    const year = selected_date.getYear() - 100

    const day = output_day_of_the_week ? ` (${days[selected_date.getDay()]})` : ''
    dates[selected_date.getTime()] = `${date}/${month}/${year}${day}`
  })

  dates_sorted = Object.keys(dates)
    .sort()
    .map((key) => dates[key])
    .join('\n')

  output_dates()
}

function update_starting_text() {
  starting_text = $('#starting-text').val()
  set_cookie_value('starting-text', starting_text)
  output_dates()
}

function output_dates() {
  text_to_copy = `${starting_text}\n\n${dates_sorted}`
  $('#scrollbox').text(text_to_copy)
}

function copy_to_clipboard() {
  navigator.clipboard.writeText(text_to_copy)
}

$(document).ready(() => {
  const cookie_starting_text = get_cookie_value('starting-text')
  if (cookie_starting_text) {
    starting_text = cookie_starting_text
    $('#starting-text').val(starting_text)
  }

  output_dates()

  $('.date')
    .datepicker({
      multidate: true,
      format: 'dd/mm/yyyy',
      calendarWeeks: true,
      clearBtn: true,
      disableTouchKeyboard: true,
      defaultViewDate: {
        month: next_month
      }
    })
    .on('changeDate', on_date_change)

  $('#day-of-the-week').change(on_date_change)
  $('#starting-text').on('input', update_starting_text)

  $('#copy-button').click(copy_to_clipboard)
})
