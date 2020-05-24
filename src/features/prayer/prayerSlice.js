import { createSlice } from '@reduxjs/toolkit';
import { signIn, currentUser, getPrayerRequest, PrayerRequest, activeQuery, onActiveQueryFetchOrChange, onRequestQueryFetchOrUpdate, requestsQuery } from "../../config/parse";

const CHURCH_ID = "saron";

export const prayerSlice = createSlice({
  name: "prayerrequest",
  initialState: {
    value: null,
  },
  reducers: {
    requestPrayer: (state, action) => {
      const { phone, name } = action.payload;
      new PrayerRequest().save({
        churchId: CHURCH_ID,
        name: name,
        phone: phone,
        requestTime: new Date(),
      });
    },
    setPrayerRequests: (state, action) => {
      if (state.value === null) {
        state.value = {};
      }
      for (let request of action.payload) {
        state.value[request.id] = request;
      }
    },
    setPrayed: (state, action) => {
      getPrayerRequest(action.payload).then((request) => {
        const prayedTime = request.get("prayedTime") === null ? new Date() : null;
        request.set("prayedTime", prayedTime);
        request.save();
      });
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
    activeQuery().first().then((prayerRoom) => {
      prayerRoom.set("active", !prayerRoom.get("active"));
      prayerRoom.save();
      if (prayerRoom.get("active")) {
        requestsQuery().find().then((prayerRequests) => {
          for (let request of prayerRequests) {
            console.log(request);
            request.destroy();
          }
        });
      }
    });
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
    return state.prayerrequest.value;
  }
};

export const doLogin = password => dispatch => {
  signIn(password).then((user) => {
    if (user) {
      dispatch(setLoggedIn(true));
      onRequestQueryFetchOrUpdate((requests) =>
        dispatch(prayerSlice.actions.setPrayerRequests(requests))
      );
    }
  });
}

export const fetchPrayerRequests = () => async (dispatch) => {
  currentUser().then((user) => {
    if (user) {
      dispatch(setLoggedIn(true));
      onRequestQueryFetchOrUpdate((requests) =>
        dispatch(prayerSlice.actions.setPrayerRequests(requests))
        );
    } else {
      dispatch(setLoggedIn(false));
    }
  });
};

export const fetchAdmin = () => async (dispatch) => {
  currentUser().then((user) => {
    if (user) {
      dispatch(setLoggedIn(true));
    } else {
      dispatch(setLoggedIn(false));
    }
  });
  onActiveQueryFetchOrChange((active) => {
    dispatch(activeSlice.actions.setActive(active));
  });
}

/* Is the prayer active right now? */
export const fetchActive = () => async (dispatch) => {
  onActiveQueryFetchOrChange((active) => {
    dispatch(activeSlice.actions.setActive(active));
  });
};

export const prayerReducer = prayerSlice.reducer;
export const loginReducer = loginSlice.reducer;
export const activeReducer = activeSlice.reducer;