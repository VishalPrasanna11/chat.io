import React from 'react';

const Chat = ({username,text})=>{
    return (
        <div className='chat'>
            <p className='chatusernname'>{username}</p>
            <p className='chattext'>{text}</p>
        </div>
    )
}

export default Chat;