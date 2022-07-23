import React, {useRef, useEffect} from 'react'
import { useSocket } from '../../contexts/Socket'
import { ToastContainer, toast, Flip } from 'react-toastify';
import '../../styles/utils.css'

const ReceiveFriendRequest = (props) => {
    const {socket} = useSocket()
    const toastId = useRef(null)
    const {addPendingFriendRequest} = props

    useEffect(() => {
      socket.on('receive-friend-request', (from) => {
        console.log(from)
        addPendingFriendRequest(from)
        toastId.current = toast.info(<span>
            <p>{from} wants to be your friend</p>
            <button style={{color: 'green', marginLeft: '35px'}} className='request-toast-btn' onClick={() => updateToast('accepted', from)}>Accept</button>
            <button style={{color: 'red', margin: '10px 30px'}} className='request-toast-btn' onClick={() => updateToast('declined', from)}>Decline</button>
          </span>, {
          containerId: 'A',
          position: "top-right",
          closeOnClick: false,
          pauseOnHover: false,
          autoClose: 5000,
          hideProgressBar: false,
          progress: undefined,
          });

          const updateToast = (status, from) => {
            if (status === 'accepted') {
              toast.update(toastId.current, {
                containerId: 'A',
                render: "Accepted friend request",
                type: toast.TYPE.SUCCESS,
                hideProgressBar: true,
                autoClose: 2000
              })
            } else if (status === 'declined') {
              toast.update(toastId.current, {
                containerId: 'A',
                render: "Declined friend request",
                type: toast.TYPE.ERROR,
                hideProgressBar: true,
                autoClose: 2000
              })      
            }
            console.log(from, status)
            socket.emit('update-request-status', from, status)
          }
      })
      return () => {
        socket.off('receive-friend-request')
      }
    }, [socket, addPendingFriendRequest])


  return (
    <>
    <ToastContainer
        enableMultiContainer containerId={'A'}
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        transition={Flip}
    />   
    </>
  )
}

export default ReceiveFriendRequest