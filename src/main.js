import Cycle from '@cycle/core'
import {makeDOMDriver, label, input, h1, hr, div} from '@cycle/dom'
import {Observable} from 'rx'

function main(sources) {
  const inputEv$ = sources.DOM
    .select('.field')
    .events('input')
  const name$ = inputEv$
    .map(ev => ev.target.value)
    .startWith('')

  const sinks = {
    DOM: name$.map(name =>
      div([
        label('Name: '),
        input('.field', {type: 'text'}),
        hr(),
        h1(`Hello ${name}!`)
      ])
    )
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers)
