    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    import React,{FC, useEffect, useState} from 'react';
    import { useDispatch, UseDispatch } from 'react-redux';
    import { setOnlineUsers } from '@redux/slices/userSlice';
    import Socket from '@services/socket/socket';

    const Appwrapwer:FC = () => {
        const dispatch = useDispatch()

        useEffect(() => {
            Socket.on('onlineusers',(users) => {
                // console.log('gloabla online users',users);
                dispatch(setOnlineUsers(users))
            })
            return ()=>{
                Socket.off('onlineusers')
            }
        },[])

        return null
    }

    export default Appwrapwer