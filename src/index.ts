import type { FormattedDates } from './types/dates'

import 'bootstrap-datepicker'
import $ from 'jquery'
import pad_zero_two from './helpers/pad-zero-two'
import PlasticCookie from './helpers/PlasticCookie'
import Clipboard from './helpers/Clipboard'

const current_date = new Date()
const start_month = current_date.getMonth() + 2
const start_date = new Date(current_date.getFullYear(), start_month)
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const starting_text_element = document.querySelector<HTMLInputElement>('#starting-text')
const scrollbox_element = document.querySelector<HTMLDivElement>('#scrollbox')

function on_date_change() {
  const selected_dates: Date[] = $('.date').datepicker('getDates')
  const output_day_of_the_week = $('#day-of-the-week').is(':checked')

  const dates = selected_dates.reduce((new_dates, selected_date) => {
    const date = pad_zero_two(selected_date.getDate())
    const month = pad_zero_two(selected_date.getMonth() + 1)
    const year = selected_date.getFullYear()
    const day = output_day_of_the_week ? ` (${days[selected_date.getDay()]})` : ''

    new_dates[selected_date.getTime()] = `${date}/${month}/${year}${day}`
    return new_dates
  }, {} as FormattedDates)

  dates_sorted = Object.keys(dates)
    .sort()
    .map((key) => dates[key])
    .join('\n')

  output_result()
}

function on_starting_text_change() {
  starting_text = get_starting_text()
  PlasticCookie.set('starting-text', starting_text)
  output_result()
}

function get_starting_text() {
  if (!starting_text_element) throw new Error(`Starting text element not found`)
  return starting_text_element.value
}

function set_starting_text(text: string) {
  if (!starting_text_element) throw new Error(`Starting text element not found`)
  starting_text_element.value = text
}

function get_scrollbox_text() {
  if (!scrollbox_element) throw new Error(`Scrollbox element not found`)

  const scrollbox_text = scrollbox_element.textContent
  return scrollbox_text ? scrollbox_text : ''
}

function set_scrollbox_text(text: string) {
  if (!scrollbox_element) throw new Error(`Scrollbox element not found`)
  scrollbox_element.textContent = text
}

function output_result() {
  set_scrollbox_text(`${starting_text}\n\n${dates_sorted}`)
}

let starting_text = ''
let dates_sorted = ''

$(() => {
  starting_text = PlasticCookie.get('starting-text') || get_starting_text()
  set_starting_text(starting_text)
  output_result()

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
  $('#starting-text').on('input', on_starting_text_change)
  $('#copy-button').on('click', () => Clipboard.add(get_scrollbox_text()))
})