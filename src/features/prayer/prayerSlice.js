import { prayerRequestRef } from "../../config/firebase"
import { createSlice } from '@reduxjs/toolkit';

export const prayerSlice = createSlice({
  name: "prayerrequest",
  initialState: {
    value: [],
  },
  reducers: {
    requestPrayer: (state, action) => {
      const { phone, name, gender } = action.payload;
      prayerRequestRef.child(`requests/${phone}`).set({
              name: name,
              phone: phone,
              gender: gender,
              prayed: false,
            });
    },
    setPrayerRequests: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { requestPrayer } = prayerSlice.actions;

export const fetchPrayerRequests = () => async (dispatch) => {
  prayerRequestRef.on("value", (snapshot) => {
    setTimeout(() => {
      dispatch(prayerSlice.actions.setPrayerRequests(snapshot.val()));
    });
  });
};

export default prayerSlice.reducer;
