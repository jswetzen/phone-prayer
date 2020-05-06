import { prayerRequestRef, activeRef, signIn, firebaseAuth } from "../../config/firebase"
import { createSlice } from '@reduxjs/toolkit';

export const prayerSlice = createSlice({
  name: "prayerrequest",
  initialState: {
    value: null,
  },
  reducers: {
    requestPrayer: (state, action) => {
      const { phone, name } = action.payload;
      const newRequestKey = prayerRequestRef.child('requests').push().key;
      prayerRequestRef.child(`requests/${newRequestKey}`).set({
              name: name,
              phone: phone,
              requestTime: + new Date(),
              prayedTime: null,
              prayed: false,
            });
    },
    setPrayerRequests: (state, action) => {
      state.value = action.payload;
    },
    setPrayed: (state, action) => {
      const requestId = action.payload;
      prayerRequestRef.child(`requests/${requestId}/prayed`)
        .set(!state.value.requests[requestId].prayed);
    },
  },
});

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    value: null,
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
    value: null,
  },
  reducers: {
    setActive: (state, action) => {
      state.value = action.payload;
    },
    toggleActive: (state, action) => {
      activeRef.set(!state.value);
    },
  },
});

export const { requestPrayer, setPrayed } = prayerSlice.actions;
export const { setLoggedIn } = loginSlice.actions;
export const { toggleActive } = activeSlice.actions;

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
  signIn(password);
}

export const fetchPrayerRequests = () => async (dispatch) => {
  setTimeout(() => {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        setTimeout(() => {
          prayerRequestRef.on("value", (snapshot) => {
            setTimeout(() => {
              dispatch(prayerSlice.actions.setPrayerRequests(snapshot.val()));
            });
          });
          dispatch(setLoggedIn(true));
        }); 
      } else {
        console.log("not logged in user:"+user)
        setTimeout(() => {
          dispatch(setLoggedIn(false));
        });
      }
    });
  });
};

export const fetchAdmin = () => async (dispatch) => {
  setTimeout(() => {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(setLoggedIn(true));
      } else {
        dispatch(setLoggedIn(false));
      }
    });
  });
  setTimeout(() => {
    activeRef.on("value", (snapshot) => {
      setTimeout(() => {
        dispatch(activeSlice.actions.setActive(snapshot.val()));
      });
    });
  });
}

/* Is the prayer active right now? */
export const fetchActive = () => async (dispatch) => {
  setTimeout(() => {
    activeRef.on("value", (snapshot) => {
      setTimeout(() => {
        dispatch(activeSlice.actions.setActive(snapshot.val()));
      });
    });
  });
};

export const prayerReducer = prayerSlice.reducer;
export const loginReducer = loginSlice.reducer;
export const activeReducer = activeSlice.reducer;