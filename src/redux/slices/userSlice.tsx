/* eslint-disable @typescript-eslint/no-unused-vars */
import { showSuccess } from '@components/Flashmessge';
import { LocalStorage } from '@helpers/localstorage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APiService } from '@services/index';

interface Userprops {
  _id: string;
}

export const Uploaduserimage = createAsyncThunk<
  Userprops,
  any,
  { rejectValue: { status: number; message: string } }
>('uploadimageuser', async (body, { rejectWithValue }) => {
  try {
    const response = await APiService.uploaduserimg(body);
    return response?.data;
  } catch (error: any) {
    return rejectWithValue({
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
    });
  }
});

export const Getuserlist = createAsyncThunk<
  Userprops[],
  any,
  { rejectValue: { status: number; message: string } }
>('getuserlist', async (body, { rejectWithValue }) => {
  try {
    const response = await APiService.getuserlist(body);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
    });
  }
});

const onlineUserSlice = createSlice({
  name: 'onlineuser',
  initialState: {
    users: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
    },
    cleanOnlineUsers: (state, action) => {
      state.users = [];
    },
  },
});

const initialState = {
  userlist: [] as Userprops[],
  isError: false,
  isLoader: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Getuserlist.pending, state => {
      state.isLoader = true;
      state.isError = false;
    }),
      builder.addCase(
        Getuserlist.fulfilled,
        (state, action: PayloadAction<Userprops[]>) => {
          state.isLoader = false;
          state.userlist = action.payload;
        },
      ),
      builder.addCase(Getuserlist.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});
export const { setOnlineUsers, cleanOnlineUsers } = onlineUserSlice.actions;
export const onlineUserReducer = onlineUserSlice.reducer;
export const UserlistReducers = userSlice.reducer;
