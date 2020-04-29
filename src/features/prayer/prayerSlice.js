import { prayerRequestRef, activeRef, signIn, firebaseAuth } from "../../config/firebase"
import { createSlice } from '@reduxjs/toolkit';

export const prayerSlice = createSlice({
  name: "prayerrequest",
  initialState: {
    value: null,
  },
  reducers: {
    requestPrayer: (state, action) => {
      const { phone, name, gender } = action.payload;
      const newRequestKey = prayerRequestRef.child('requests').push().key;
      prayerRequestRef.child(`requests/${newRequestKey}`).set({
              name: name,
              phone: phone,
              gender: gender,
              prayed: false,
            });
    },
    setPrayerRequests: (state, action) => {
      state.value = action.payload;
    },
    setPrayed: (state, action) => {
      const requestId = action.payload;
      prayerRequestRef.child(`requests/${requestId}/prayed`).set(true);
    },
  },
});

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    value: false,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.value = action.payload;
    }
  },
});

export const activeSlice = createSlice({
  name: "active",
  initialState: {
    value: false,
  },
  reducers: {
    setActive: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { requestPrayer, setPrayed } = prayerSlice.actions;
export const { setLoggedIn } = loginSlice.actions;
export const { setActive } = activeSlice.actions;

export const selectActive = state => state.active.value
export const selectLoggedIn = state => state.login.value
export const selectPrayerRequests = state => {
  if (state.prayerrequest.value === null) {
    return {};
  } else {
    return state.prayerrequest.value.requests;
  }
};

export const doLogin = password => dispatch => {
  signIn(password, () => {
      setTimeout(() => {
        dispatch(setLoggedIn(true))
      });
  }, (snapshot) => {
    dispatch(prayerSlice.actions.setPrayerRequests(snapshot.val()));
  });
}

export const fetchPrayerRequests = () => async (dispatch) => {
  firebaseAuth().onAuthStateChanged((user) => {
    if (user) {
      setTimeout(() => {
        dispatch(setLoggedIn(true));
      });
    } else {
      console.log("not logged in user:"+user)
      setTimeout(() => {
        dispatch(setLoggedIn(false));
      });
    }
  });
  prayerRequestRef.on("value", (snapshot) => {
    setTimeout(() => {
      dispatch(prayerSlice.actions.setPrayerRequests(snapshot.val()));
    });
  });
};

/* Is the prayer active right now? */
export const fetchActive = () => async (dispatch) => {
  activeRef.on("value", (snapshot) => {
    console.log(snapshot);
    setTimeout(() => {
      dispatch(activeSlice.actions.setActive(snapshot.val()));
    });
  });
};

export const prayerReducer = prayerSlice.reducer;
export const loginReducer = loginSlice.reducer;
export const activeReducer = activeSlice.reducer;