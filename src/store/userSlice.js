import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const useSlice = createSlice({
    name: 'user',
    initialState: {
        token: Cookies.get('_auth')
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token
        }
    }
});

export const { setToken } = useSlice.actions;

export default useSlice.reducer;