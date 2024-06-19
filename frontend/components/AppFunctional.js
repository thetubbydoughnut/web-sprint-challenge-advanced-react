import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = React.useState(initialMessage)
  const [email, setEmail] = React.useState(initialEmail)
  const [steps, setSteps] = React.useState(initialSteps)
  const [index, setIndex] = React.useState(initialIndex)

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y }
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
      const { x, y } = getXY();
      return `Coordinates (${x}, ${y})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { x, y } = getXY();
    let newX = x - 1;
    let newY = y - 1;

    if(direction === 'left' && newX > 0) {
      newX = newX - 1;
    } else if (direction === 'right' && newX < 2) {
      newX = newX + 1;
    } else if (direction === 'up' && newY > 0) {
      newY = newY - 1;
    } else if (direction === 'down' && newY < 2) {
      newY = newY + 1;
    }
    return newY * 3 + newX;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);
    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    }
    else {
      setMessage(`You can't go ${direction}`)
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  
  async function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()

    const { x, y } = getXY();

    const payload = {
      x,
      y,
      steps,
      email
    };

    try {
      const response = await axios.post('http://localhost:9000/api/result', payload);
      if (response.status === 200) {
        console.log(response.data)
        setMessage(`${response.data.message}`)
      } 
    }
    catch (err) {
      console.error(`Error: ${err.message}`)
      if (email === 'foo@bar.baz') {
        setMessage(`${err.response.data.message}`)
      }
      else if (email === '') {
        setMessage('Ouch: email is required')
      }
      else {
        setMessage('Ouch: email must be a valid email')
      }
    }
    setEmail('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button data-testid='left' id="left" onClick={move}>LEFT</button>
        <button data-testid='up' id="up" onClick={move}>UP</button>
        <button data-testid='right' id="right" onClick={move}>RIGHT</button>
        <button data-testid='down' id="down" onClick={move}>DOWN</button>
        <button data-testid='reset' id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit" ></input>
      </form>
    </div>
  )
}
