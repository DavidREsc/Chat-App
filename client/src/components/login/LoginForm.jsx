import React, {useState} from 'react'

const LoginForm = (props) => {
  
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {handleSubmit} = props

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, {
        email,
        password
      })}>
        <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default LoginForm