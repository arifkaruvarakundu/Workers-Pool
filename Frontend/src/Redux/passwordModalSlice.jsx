import { createSlice } from "@reduxjs/toolkit";


const passwordModalSlice = createSlice({
    name:'passwordModal',
    initialState:{
        isChangePasswordModalOpen:false,
    },
    reducers: {
        openPasswordModal:(state)=>{
            state.isChangePasswordModalOpen=true;
        },
        closePasswordModal:(state)=>{
            state.isChangePasswordModalOpen=false;
        },
    },
});

export const {openPasswordModal,closePasswordModal} =passwordModalSlice.actions;
export default passwordModalSlice.reducer;