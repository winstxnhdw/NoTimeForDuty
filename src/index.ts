import * as clipboard from '@/helpers/clipboard'
import * as cookie from '@/helpers/cookie'
import { pad_zero_two } from '@/utils/padding'
import 'bootstrap-datepicker'
import $ from 'jquery'

const current_date = new Date()
const start_month = current_date.getMonth() + 2
const start_date = new Date(current_date.getFullYear(), start_month)
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const starting_text_element = document.querySelector<HTMLInputElement>('#starting-text')
const scrollbox_element = document.querySelector<HTMLDivElement>('#scrollbox')
const show_day_element = document.querySelector<HTMLInputElement>('#show-day')

type DateWithDay = {
  date: string
  day: string
}

function on_date_change() {
  const selected_dates = $('.date').datepicker('getDates') as Date[]

  const dates = selected_dates.reduce((new_dates, selected_date) => {
    const date = pad_zero_two(selected_date.getDate())
    const month = pad_zero_two(selected_date.getMonth() + 1)
    const year = selected_date.getFullYear()
    const day = `(${days[selected_date.getDay()]})`

    new_dates.set(selected_date.getTime(), {
      date: `${date}/${month}/${year}`,
      day: day,
    })

    return new_dates
  }, new Map<number, DateWithDay>())

  dates_sorted = [...new Map([...dates].sort()).values()]
  output_result()
}

function on_starting_text_change() {
  starting_text = get_starting_text()
  cookie.set('starting-text', starting_text)
  output_result()
}

async function on_copy() {
  if (!scrollbox_element) throw new Error(`Scrollbox element not found`)

  const scrollbox_text = scrollbox_element.textContent
  await clipboard.add(scrollbox_text ? scrollbox_text : '')
}

function get_starting_text() {
  if (!starting_text_element) throw new Error(`Starting text element not found`)
  return starting_text_element.value
}

function set_starting_text() {
  if (!starting_text_element) throw new Error(`Starting text element not found`)
  starting_text_element.value = starting_text
}

function output_result() {
  if (!scrollbox_element) throw new Error(`Scrollbox element not found`)
  if (!show_day_element) throw new Error(`Show day element not found`)

  const dates_string = dates_sorted
    ? dates_sorted
        .map((date_obj) => {
          return `${date_obj.date} ${show_day_element.checked ? date_obj.day : ''}`
        })
        .join('\n')
    : ''

  scrollbox_element.textContent = `${starting_text}\n\n${dates_string}`
}

let starting_text = ''
let dates_sorted: DateWithDay[]

$(() => {
  starting_text = cookie.get('starting-text') || get_starting_text()
  set_starting_text()
  output_result()

  $('.date')
    .datepicker({
      multidate: true,
      format: 'dd/mm/yyyy',
      calendarWeeks: true,
      clearBtn: true,
      defaultViewDate: start_date,
    })
    .on('changeDate', on_date_change)

  $('#show-day').on('change', output_result)
  $('#starting-text').on('input', on_starting_text_change)
  $('#copy-button').on('click', () => {
    on_copy().catch(console.error)
  })
})
