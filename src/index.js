import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'

firebase.initializeApp({
  apiKey: "AIzaSyDqr45-XeJ09h2LeL8b70-tnl34JSPzibA",
  authDomain: "tommyland-d4311.firebaseapp.com",
  databaseURL: "https://tommyland-d4311-default-rtdb.firebaseio.com",
  projectId: "tommyland-d4311",
  storageBucket: "tommyland-d4311.appspot.com",
  messagingSenderId: "288059893434",
  appId: "1:288059893434:web:f55e7d629341e33e59c483"
})

const getData = path => new Promise(resolve => {
  firebase.database().ref(path).once('value', snapshot => resolve(snapshot.val()))
})

const setData = (path, value) => new Promise(resolve => {
  firebase.database().ref(path).set(value).then(resolve)
})

const subscribeToData = (path, callback) => 
  firebase.database().ref(path).on('value', snapshot => callback(snapshot.val()))

// ---

class VenuesBanned extends React.PureComponent {

  componentDidMount() {
    subscribeToData('venues_banned', venues => this.setState({ venues: venues || [] }))
  }

  state = { 
    venues: [],
    newVenueName: ''
  }

  handleInputChangeEvent = event => {
    const updatedNewName = event.target.value
    this.setState({ newVenueName: updatedNewName })
  }

  addVenue = () => {
    const newVenueName = this.state.newVenueName
    setData(`venues_banned/${newVenueName}`, true)
    this.setState({ newVenueName: '' })
  }

  render = () => {

    const bannedVenuesList = Object.keys(this.state.venues)
      .slice(0, this.props.max)

    return (
      <div>
        <h1 style={{ color: 'red' }}> 
          venues banned:
        </h1>
        <input 
          value={this.newVenueName} 
          placeholder={'new venue name'} 
          onChange={this.handleInputChangeEvent}
        />
        <button onClick={this.addVenue}>
          addVenue
        </button>
        <div>
          {bannedVenuesList.map(venue => <div> {venue}</div>) }
        </div>
      </div>
    )
  }
}

const ColorButton = props => {
  return (
    <button 
      style={{ background: props.color }} 
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

class Tommy extends React.PureComponent {

  constructor() {
    super()
    window.tommy = this
  }

  state = { 
    backgroundColor: 'white',
    greeting: 'welcome to tommyland' 
  }

  changeGreet = () => {
    this.setState({ greeting: 'fuck u im tommy ye' })
  }

  changeBackgroundColor = color => {
    this.setState({ backgroundColor: color })
  } 

  render = () => {
    return (
      <div style={{ background: this.state.backgroundColor }}>
        <ColorButton label='im blue' color='blue' onClick={() => this.changeBackgroundColor('blue')}/>
        <ColorButton label='im red' color='red' onClick={() => this.changeBackgroundColor('red')}/>
        <h1 style={{ color: 'blue' }}> 
          {this.state.greeting} 
        </h1>
        <button onClick={this.changeGreet}>
          change greeting
        </button>
        <div>
          <VenuesBanned max={3}/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Tommy/>, document.getElementById('root'))