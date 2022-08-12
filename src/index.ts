import $ from 'jquery'
import PlasticCookie from './helpers/PlasticCookie'

type FormattedDates = {
  [key: string]: string
}

const current_date = new Date()
const next_month = current_date.getMonth() + 2
const start_date = new Date(current_date.getFullYear(), next_month)
const scrollbox = document.getElementById('scrollbox')
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let starting_text = get_starting_text()
let text_to_copy: string = starting_text
let dates_sorted = ''

function on_date_change() {
  const selected_dates: Date[] = $('.date').datepicker('getDates')
  const dates = {} as FormattedDates
  const output_day_of_the_week = $('#day-of-the-week').is(':checked')

  selected_dates.forEach((selected_date) => {
    const date = selected_date.getDate()
    const month = selected_date.getMonth() + 1
    const year = selected_date.getFullYear() - 100

    const day = output_day_of_the_week ? ` (${days[selected_date.getDay()]})` : ''
    dates[selected_date.getTime()] = `${date}/${month}/${year}${day}`
  })

  dates_sorted = Object.keys(dates)
    .sort()
    .map((key) => dates[key])
    .join('\n')

  output_dates()
}

function get_starting_text() {
  const selector = '#starting-text'
  const starting_text = document.querySelector<HTMLInputElement>(selector)
  if (!starting_text) throw new Error(`Selector ${selector} not found`)

  return starting_text.value
}

function update_starting_text() {
  PlasticCookie.set('starting-text', get_starting_text())
  output_dates()
}

function output_dates() {
  text_to_copy = `${starting_text}\n\n${dates_sorted}`
  $('#scrollbox').text(text_to_copy)
}

function copy_to_clipboard() {
  navigator.clipboard.writeText(text_to_copy)
}

$(() => {
  const cookie_starting_text = PlasticCookie.get('starting-text')
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
      defaultViewDate: start_date
    })
    .on('changeDate', on_date_change)

  $('#day-of-the-week').on('change', on_date_change)
  $('#starting-text').on('input', update_starting_text)

  $('#copy-button').on('click', copy_to_clipboard)
})
