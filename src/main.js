import Cycle from '@cycle/core'
import {makeDOMDriver, button, h1, h4, a, div} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'

function main (sources) {
  const clickEvent$ = sources.DOM
    .select('.get-first')
    .events('click')

  const url = 'http://jsonplaceholder.typicode.com/users/1'

  // could be move to the bottom like DOM firstUser$.map
  const request$ = clickEvent$.map(() => ({
    url,
    method: 'GET'
  }))

  const response$$ = sources.HTTP
    .filter((response$) => response$.request.url === url)

  // switch is like flatten
  const response$ = response$$.switch()

  const firstUser$ = response$
    .map((response) => response.body)
    .startWith(null)

  const sinks = {
    DOM: firstUser$.map((firstUser) =>
      div([
        button('.get-first', 'Get first user'),
        firstUser === null ? null : div('.user-details', [
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', {href: firstUser.website}, firstUser.website)
        ])
      ])
    ),
    HTTP: request$
  }

  return sinks
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
}

Cycle.run(main, drivers)
