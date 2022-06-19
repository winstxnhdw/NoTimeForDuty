const next_month = new Date().getMonth() + 1
const scrollbox = document.getElementById('scrollbox')
const starting_text = scrollbox.textContent
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let text_to_copy = starting_text

function on_date_change() {
  const selected_dates = $('.date').datepicker('getDates')
  const dates = {}

  selected_dates.forEach((selected_date) => {
    const day = days[selected_date.getDay()]
    const date = selected_date.getDate()
    const month = selected_date.getMonth() + 1
    const year = selected_date.getYear() - 100
    dates[selected_date.getTime()] = `${date}/${month}/${year} (${day})`
  })

  const dates_sorted = Object.keys(dates)
    .sort()
    .map((key) => dates[key])
    .join('\n')

  text_to_copy = `${starting_text}\n\n${dates_sorted}`
  $('#scrollbox').text(text_to_copy)
}

function copy_to_clipboard() {
  navigator.clipboard.writeText(text_to_copy)
}

$(document).ready(() => {
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

  $('#copy-button').click(copy_to_clipboard)
})
