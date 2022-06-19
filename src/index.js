const next_month = new Date().getMonth() + 1
const scrollbox = document.getElementById('scrollbox')
const starting_text = scrollbox.textContent

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function on_date_change() {
  const selected_dates = $('.date').datepicker('getDates')
  const dates = []

  selected_dates.forEach((selected_date) => {
    const day = days[selected_date.getDay()]
    const date = selected_date.getDate()
    const month = selected_date.getMonth() + 1
    const year = selected_date.getYear() - 100
    dates.push(`${date}/${month}/${year} (${day})`)
  })

  $('#scrollbox').text(`${starting_text}\n\n${dates.join('\n')}`)
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
})
