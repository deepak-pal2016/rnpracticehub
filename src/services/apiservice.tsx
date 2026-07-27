/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { LocalStorage } from '../helpers/localstorage';
import moment from 'moment';

const LIVE_API_URL =
  'https://nannie-unfenestral-preculturally.ngrok-free.dev/api/';
export const API_URL = LIVE_API_URL;

const APIKit = axios.create({
  baseURL: LIVE_API_URL,
  timeout: 30000,
});

//! Axios Interceptor For Handling Missing Authentication
export const SetAPIResponseInterceptors = ({ On401Error = () => {} }) => {
  APIKit.interceptors.response.use(
    response => {
      if (response.status === 401 && On401Error) {
        On401Error();
      }
      return response;
    },
    error => Promise.reject(error),
  );
};

const headersdata = async (withAuth: boolean = true) => {
  try {
    const token = await LocalStorage.read('@token');
    const headers: any = {
      'Content-Type': 'application/json',
    };
    if (withAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  } catch (error) {
    console.log('Header error:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};

const APiService = {
  login: async (payload: any) => {
    const headers = await headersdata(false);
    return APIKit.post('loginuser', payload, { headers });
  },

  signup: async (paylaod: any) => {
    const headers = await headersdata(true);
    return APIKit.post('adduser', paylaod, { headers });
  },
  getuserlist: async (payload: any) => {
    const headers = await headersdata(true);
    return APIKit.post('getuser', { email: payload }, { headers });
  },
  addTask: async (payload: any) => {
    const headers = await headersdata(true);
    return APIKit.post('addtask', payload, { headers });
  },
  getuseralltask: async (payload: any) => {
    const headers = await headersdata(true);
    return APIKit.post('getusertask', { userid: payload }, { headers });
  },

  markedcompletetask: async (payload: any) => {
    const headers = await headersdata(true);
    return APIKit.post('completetask', payload, { headers });
  },

  fetchuserchats: async (payload: any) => {
    const headers = await headersdata(true);
    return APIKit.post('getuserchats', payload, { headers });
  },

  logout: async () => {
    const headers = await headersdata(true);
    return APIKit.post('logoutuser', {}, { headers });
  },

  uploadFile: async (formData: FormData) => {
    try {
      const token = await LocalStorage.read('@token');
      const resp:any = await APIKit.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return resp?.data
    } catch (error) {
      console.log('Upload Error:', error);
      throw error;
    }
  },
  deletetaskbyid: async (taskId: string) => {
    const headers = await headersdata(true);
    return APIKit.delete(`deletetask/${taskId}`, { headers });
  },
 uploaduserimg: async (formData: FormData) => {
  const token = await LocalStorage.read('@token');
  return APIKit.post('uploaduserimg', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
},
};

export default APiService;
