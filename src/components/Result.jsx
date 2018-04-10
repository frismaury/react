const React = require('react');
const Link = require('react-router-dom').Link;
const PropTypes = require('prop-types');
const queryString = require('query-string');
const api = require('../utils/api');

const PlayerPreview = require('./PlayerPreview')
const Loading = require('./Loading');

class Result extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    }
  }

  componentDidMount() {
    var players = queryString.parse(this.props.location.search);

    api.battle([
      players.playerOneName,
      players.playerTwoName
    ]).then((results) => {
      if (results === null) {
        return this.setState(() => {
          return {
            error: 'Looks like there was an error. Check that both users exist on Github',
            loading: false,
          }
        })
      }

      this.setState(() => {
        return {
          winner: results[0],
          loser: results[1],
          error: null,
          loading: false,
        }
      })
    });
  }

  render() {
    var winner = this.state.winner;
    var loser = this.state.loser;
    var error = this.state.error;
    var loading = this.state.loading;

    if (loading === true) {
      return <Loading />
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to='/battle'>Reset</Link>
        </div>
      )
    }

    return (
      <div className="row">
        <Player
          label='Winner'
          score={winner.score}
          profile={winner.profile}
        />

        <Player
          label='Loser'
          score={loser.score}
          profile={loser.profile}
        />
      </div>
    )
  }
}

function Player(props) {
  return (
    <div className='player-profile'>
      <h1 className='header'>{props.label}</h1>
      <h3>Score: {props.score}</h3>
      <Profile info={props.profile} />
    </div>
  )
}

function Profile(props) {
  let info = props.info;
  return (
    <PlayerPreview
      avatar={info.avatar_url}
      username={info.login}>
      <ul className="space-list-items">
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Followers: {info.followers}</li>
        <li>Following: {info.following}</li>
        <li>Public Repos: {info.public_repos}</li>
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
      </ul>
    </PlayerPreview>
  )
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
}

Profile.propTypes = {
  info: PropTypes.object.isRequired,
}

module.exports = Result;
