import React, {useState} from 'react'

const SignupForm = (props) => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {handleSubmit} = props
  return (
    <div>
        <form onSubmit={(e) => handleSubmit(e, {
            firstName,
            lastName,
            email,
            password
        })}>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
            <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'>
            </input>
            <button>Sign up</button>
        </form>
    </div>
  )
}

export default SignupForm