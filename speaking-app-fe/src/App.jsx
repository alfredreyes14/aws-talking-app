import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react'
import AudioHelper from './utils/Audio'
import { send } from './services/speak';

const voices = [
  {
    value: 1,
    name: "Matthew"
  },
  {
    value: 2,
    name: "Joanna"
  },
  {
    value: 3,
    name: "Ivy"
  },
  {
    value: 4,
    name: "Justin"
  }
]

const App = () => {
  const [ sentence, setSentence ] = useState('')
  const [ voiceActor, setVoiceActor ] = useState("Matthew")
  const [ buttonText, setButtonText ] = useState("Speak Now")
  const [ disabled, setDisabled ] = useState(false)
  const playAudio = url => {
    const audioInstance = new AudioHelper(url)
    audioInstance.play()
    
    audioInstance.audio.addEventListener('ended', () => {
      if (audioInstance.audio.ended) {
        setDisabled(false)
        setButtonText('Speak Now')
      }
    })
  }

  const callToast = message => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  const handleSubmit = async () => {
    if (sentence === '') {
      callToast('Invalid input')
      return
    }
    setDisabled(true)
    const payload = JSON.stringify({
      text: sentence,
      voice: voiceActor
    })
    try {
      const data = await send('/dev/speak', payload)
      const url = data.url
      setButtonText('Speaking...')
      playAudio(url)
    } catch (error) {
      callToast('There was an error in processing your input')
      setDisabled(false)
      console.error(error)
    }
  }

  return (
    <>
      <div className="container">
        <h2>Talking App powered by AWS Lambda and Polly</h2>
        <div className="input-textarea">
          <textarea
            cols="60"
            rows="10"
            value={sentence}
            onChange={(event) => setSentence(event.target.value)}
          />
        </div>
        <div className="voice-container">
          <select 
            onChange={(event) => {
              const actor = voices.find(item => item.value === parseInt(event.target.value))
              setVoiceActor(actor.name)
            }}
          >
            {voices.map(item => (
              <option 
                key={item.value} 
                value={item.value}
              >
                { item.name }
              </option>
            ))}
          </select>
        </div>
        <div className="speak-container" style={{ marginTop: '10px' }}>
          <button disabled={disabled} onClick={() => handleSubmit() }>{ buttonText }</button>
        </div>
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  )
}

export default App
