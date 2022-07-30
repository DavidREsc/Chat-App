import React from 'react'
import {Avatar, AvatarBadge} from '@chakra-ui/react'

const UserAvatar = (props) => {
  const {size, src, name, bg, color, badge, badgeColor} = props
  return (
    <Avatar bg={bg || '#CCC'} color={color || '#000'} size={size} name={name} src={src}>
      {badge && 
      <AvatarBadge boxSize='1.2em' bg={badgeColor}>
      </AvatarBadge>}
    </Avatar>
  )
}

export default UserAvatar