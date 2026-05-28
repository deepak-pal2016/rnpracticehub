/* eslint-disable @typescript-eslint/no-unused-vars */
import { showSuccess } from '@components/Flashmessge';
import { LocalStorage } from '@helpers/localstorage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APiService } from '@services/index';
import { create } from 'lodash';
import { Task } from 'react-native';

interface Deletetaskprops {
  taskid?: any;
}

interface TaskProps {
  title: string;
  description: string;
  duedate: string;
  priority: string;
  userId: string;
  category: string;
  assignedBy: string;
}

interface Markedtask {
  taskId: string;
  remarks: string;
  taskdate: string;
  taskstatus: string;
}

interface Gettaskprops {
  userid: string;
}

export const AddTask = createAsyncThunk<
  TaskProps,
  any,
  { rejectValue: string }
>('addTask', async (body, { rejectWithValue }) => {
  try {
    const response = await APiService.addTask(body);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Something went wrong',
    );
  }
});

export const Getallusertask = createAsyncThunk<
  TaskProps,
  any,
  { rejectValue: string }
>('getalltask', async (body, { rejectWithValue }) => {
  try {
    const resp = await APiService.getuseralltask(body);
    return resp?.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Something went wrong',
    );
  }
});

export const Markedcompletetask = createAsyncThunk<
  Markedtask,
  any,
  { rejectValue: string }
>('markedcompletetask', async (body, { rejectWithValue }) => {
  try {
    const resp: any = await APiService.markedcompletetask(body);
    return resp?.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Something went wrong',
    );
  }
});
export const Deletetaskbyid = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>('deletetaskbyid', async (taskId, { rejectWithValue }) => {
  try {
    const resp: any = await APiService.deletetaskbyid(taskId);
    return resp.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Something went wrong',
    );
  }
});

const initialState = {
  data: {} as TaskProps,
  isError: false,
  isLoader: false,
};

const markedtaskInitialState = {
  data: {} as Markedtask,
  isError: false,
  isLoader: false,
};

const GetalltaskSlice = createSlice({
  name: 'getalltask',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Getallusertask.pending, (state, action) => {
      state.isLoader = true;
      state.isError = false;
    });
    builder.addCase(
      Getallusertask.fulfilled,
      (state, action: PayloadAction<TaskProps>) => {
        state.isLoader = false;
        state.data = action.payload;
        state.isError = false;
      },
    );
    builder.addCase(Getallusertask.rejected, state => {
      state.isLoader = false;
      state.isError = true;
    });
  },
});

const TaskSlice = createSlice({
  name: 'addtask',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(AddTask.pending, state => {
      state.isLoader = true;
      state.isError = false;
    });
    builder.addCase(
      AddTask.fulfilled,
      (state, action: PayloadAction<TaskProps>) => {
        state.isLoader = false;
        state.data = action.payload;
      },
    ),
      builder.addCase(AddTask.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});

const MarkedcompletetaskSlice = createSlice({
  name: 'makedcompletetask',
  initialState: markedtaskInitialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Markedcompletetask.pending, state => {
      state.isLoader = true;
      state.isError = false;
    });
    builder.addCase(
      Markedcompletetask.fulfilled,
      (state, action: PayloadAction<Markedtask>) => {
        state.isLoader = false;
        state.data = action.payload;
      },
    ),
      builder.addCase(Markedcompletetask.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});

const TaskdeleteSlice = createSlice({
  name: 'deletetask',
  initialState: markedtaskInitialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(Deletetaskbyid.pending, state => {
      state.isLoader = true;
      state.isError = false;
    });
    builder.addCase(
      Deletetaskbyid.fulfilled,
      (state, action: PayloadAction<Deletetaskprops>) => {
        state.isLoader = false;
        //@ts-ignore
        state.data = action.payload;
      },
    ),
      builder.addCase(Deletetaskbyid.rejected, state => {
        state.isLoader = false;
        state.isError = true;
      });
  },
});

export const AddtaskReducers = TaskSlice.reducer;
export const GetalltaskReducers = GetalltaskSlice.reducer;
export const MarkedcompletedtaskReducers = MarkedcompletetaskSlice.reducer;
export const DeletetaskReducers = TaskdeleteSlice.reducer;
