import React from 'react'
import {BsFillCircleFill} from 'react-icons/bs'
import { Tabs, TabList, Tab, Heading, Center } from '@chakra-ui/react'

const FriendList = (props) => {
    const {friendList, selectFriend} = props
    const onlineStyle = {color: '#0BDA51'}
    const offlineStyle = {color: 'red'}
  return (
    <div style={{width: '100%'}}>
        <Center mt='20' mb='5' borderBottom='1px solid black' p='3'>
            <Heading size='md'>Friends</Heading>
        </Center>
        <Tabs colorScheme='gray' variant='solid-rounded' size='lg' style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <TabList style={{display: 'flex', flexDirection: 'column', width: '80%', padding: '0em'}}>
                {friendList && friendList.map((friend, idx) => {
                    return <Tab key={idx} onClick={() => selectFriend(friend.friend)}>
                                <span className='friend-list-item-container'>
                                    <BsFillCircleFill 
                                        className='online-status-indicator'
                                        style={friend.status ? onlineStyle : offlineStyle}/>
                                    {friend.friend}
                                </span>
                           </Tab>
                })}
            </TabList>
        </Tabs>
    </div>
  )
}

export default FriendList