import React from 'react'
import {AvatarBadge} from '@chakra-ui/react'
import UserAvatar from './UserAvatar'
import { Tabs, TabList, Tab, Heading, Center } from '@chakra-ui/react'

const FriendList = (props) => {
    const {friendList, selectFriend} = props
  return (
    <div style={{width: '100%', overflow: 'auto', marginTop:'5em'}}>
        <Center mt='10' mb='5' p='3'>
            <Heading size='md'>Friends</Heading>
        </Center>
        {friendList.length ? 
        <Tabs colorScheme='facebook' variant='solid-rounded' size='lg' style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <TabList style={{display: 'flex', flexDirection: 'column', width: '80%', padding: '0em'}}>
                {friendList && friendList.map((friend, idx) => {
                    return <Tab key={idx} onClick={() => selectFriend(friend.friend)}>
                                <span className='friend-list-item-container'>
                                    <UserAvatar size={'sm'} name={friend.friend} badge={true} badgeColor={friend.status ? 'green.500' : 'tomato'}
                                        className='online-status-indicator'>
                                        <AvatarBadge></AvatarBadge>
                                    </UserAvatar>
                                    
                                    {friend.friend}
                                </span>
                           </Tab>
                })}
            </TabList>
        </Tabs> : 
        <p className='no-friends-text '>Add a friend to start chatting!</p>}
    </div>
  )
}

export default FriendList