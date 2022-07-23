import React from 'react'
import PendingFriendRequestContainer from './PendingFriendRequestContainer'
import {Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerOverlay, useDisclosure} from '@chakra-ui/react'
import {AiFillMail} from 'react-icons/ai'

const PendingFriendRequestsDrawer = (props) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {pendingFriendRequests} = props
  return (
    <>
        <button 
            onClick={onOpen} 
            className='pending-friend-requests-btn'>
            <AiFillMail 
                className='pending-friend-requests-icon'
            />
            <p className='pending-friend-requests-count'>{pendingFriendRequests.length ? pendingFriendRequests.length : null}</p>
        </button>
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='sm'>
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerHeader>
                    Friend Requests
                </DrawerHeader>
                <DrawerBody>
                    <ul>
                        {pendingFriendRequests && pendingFriendRequests.map((r, idx) => {
                            return (
                                <PendingFriendRequestContainer key={idx} request={r}/>
                            )
                        })}
                    </ul>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
  )
}

export default PendingFriendRequestsDrawer