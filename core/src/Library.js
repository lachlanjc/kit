import React from 'react'
import PropTypes from 'prop-types'
import nano from 'nano-style'
import {
  BrowserRouter,
  StaticRouter,
  Route,
  NavLink,
  Link,
  withRouter
} from 'react-router-dom'
import { Grid, Box } from './ui'

const Root = nano('div')({
  display: 'flex',
  alignItems: 'flex-start',
  height: '100vh'
})

const Main = nano('div')({
  flex: '1 1 auto',
  height: '100vh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
})

const Card = nano(Link)({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
  overflow: 'hidden',
  border: '1px solid #f6f6f6',
  '&:hover': {
    borderColor: '#ddd'
  }
})

const SideBar = nano('div')({
  width: '192px',
  flex: 'none',
  height: '100vh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  borderRight: '1px solid #f6f6f6'
})

const NavItem = nano(NavLink)({
  display: 'block',
  paddingLeft: '8px',
  paddingRight: '8px',
  paddingTop: '4px',
  paddingBottom: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  textDecoration: 'none',
  color: 'inherit',
  WebkitUserSelect: 'none',
  userSelect: 'none',
  '&.active': {
    color: 'white',
    backgroundColor: 'black'
  }
})

const Router = typeof document !== 'undefined' ? BrowserRouter : StaticRouter

export class Library extends React.Component {
  render() {
    const { basename, ...props } = this.props

    return (
      <Router basename={basename} context={{}}>
        <LibraryApp {...props} />
      </Router>
    )
  }
}

const LibraryApp = withRouter(
  class extends React.Component {
    static propTypes = {
      title: PropTypes.string,
      examples: PropTypes.array,
      renderSideNav: PropTypes.func,
      renderCard: PropTypes.func
    }

    getExampleChildren = ({ children }) =>
      React.Children.toArray(children)
        .filter(c => c.type._kitLibraryExample)
        .filter(c => !!c.props.name)
        .map(c => ({
          name: c.props.name,
          element: c.props.children
        }))

    render() {
      const { title, renderSideNav, renderCard } = this.props

      const examples =
        this.props.examples || this.getExampleChildren(this.props)

      const sidenav =
        typeof renderSideNav === 'function' ? (
          renderSideNav({ ...this.state, title, examples })
        ) : (
          <SideNav title={title} examples={examples} />
        )

      return (
        <Root>
          <SideBar>{sidenav}</SideBar>
          <Main>
            <Route
              exact
              path="/"
              render={() => (
                <Grid>
                  {examples.map(example => (
                    <Card key={example.name} to={'/' + example.name}>
                      {typeof renderCard === 'function' ? (
                        renderCard(example)
                      ) : (
                        <Box p={2}>{example.element}</Box>
                      )}
                    </Card>
                  ))}
                </Grid>
              )}
            />
            {examples.map(example => (
              <Route
                key={example.name}
                path={'/' + example.name}
                render={() => <Box p={2}>{example.element}</Box>}
              />
            ))}
          </Main>
        </Root>
      )
    }
  }
)

class SideNav extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    examples: PropTypes.array
  }

  static defaultProps = {
    title: 'Kit',
    examples: []
  }

  render() {
    const { examples, title } = this.props

    return (
      <React.Fragment>
        <NavItem exact to="/">
          {title}
        </NavItem>
        {examples.map(example => (
          <NavItem key={example.name} to={'/' + example.name}>
            {example.name}
          </NavItem>
        ))}
      </React.Fragment>
    )
  }
}

export class Example extends React.Component {
  static _kitLibraryExample = true
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render() {
    return <React.Fragment {...this.props} />
  }
}

export const Detail = withRouter(
  class extends React.Component {
    render() {
      const { location } = this.props
      if (location.pathname === '/') return false

      return <div {...this.props} />
    }
  }
)

export default Library
