import React from 'react'
import PendingFriendRequestsDrawer from './PendingFriendRequestsDrawer'

const PendingFriendRequests = (props) => {
  const {pendingFriendRequests} = props
  return (
    <>
      <PendingFriendRequestsDrawer pendingFriendRequests={pendingFriendRequests}/>
    </>
  )
}

export default PendingFriendRequests