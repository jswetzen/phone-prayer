import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { prayerReducer, loginReducer, activeReducer } from '../features/prayer/prayerSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    prayerrequest: prayerReducer,
    login: loginReducer,
    active: activeReducer,
  },
});
