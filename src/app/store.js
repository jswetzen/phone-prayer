import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import prayerReducer from '../features/prayer/prayerSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    prayerrequest: prayerReducer,
  },
});
