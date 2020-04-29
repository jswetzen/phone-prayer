import React, { Component, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  requestPrayer,
  fetchActive,
  fetchPrayerRequests,
  selectPrayerRequests,
  setPrayed,
  doLogin,
  selectLoggedIn,
  selectActive,
} from './prayerSlice';
import styles from './Prayer.module.css';

class PrayerRequestLoader extends Component {
    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        return(
            <div>
              <this.props.childComponent ></this.props.childComponent>
            </div>
        )
    }
}

export function PrayerRequestComponent() {
  const dispatch = useDispatch();
  const active = useSelector(selectActive);
  const [name, setName] = useState('Kalle');
  const [phone, setPhone] = useState('031');
  const [gender, setGender] = useState('Man');
  const [submitted, setSubmitted] = useState(false);

  var result;
  if (!active) {
    result =
      <div>
        <span>Förbönen är öppen under gudstjänsterna på söndagar</span>
      </div>;
  } else if (submitted) {
    result =
        <div>
          <span>Du kommer bli uppringd!</span>
        </div>;
  } else {
    result =
        <div>
          <div>
            <label htmlFor="name">Namn</label>
            <input
              aria-label="Namn"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label htmlFor="phone">Telefon</label>
            <input
              aria-label="Telefonnummer"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <br />
            <label htmlFor="gender">Kön</label>
            <input
              aria-label="Kön"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <br />
          </div>
          <div>
            <button
              className={styles.button}
              aria-label="Jag önskar förbön"
              onClick={() => {
                setSubmitted(true);
                dispatch(
                  requestPrayer({ name: name, gender: gender, phone: phone })
                );
              }}
            >
              Jag önskar förbön
            </button>
          </div>
        </div>;
  }
        return result;
}

export function PrayerListComponent() {
  const prayerRequests = useSelector(selectPrayerRequests);
  const loggedIn = useSelector(selectLoggedIn);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const loginForm = (
    <div>
      <h1>Ange lösenord för förebedjare</h1>
      <input
        aria-label="Lösenord"
        id="password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button
        className={styles.button}
        aria-label="Logga in"
        onClick={() => {
          dispatch(
            doLogin(password)
          )
        }}
      >Logga in</button>
    </div>
  );

  const prayerList = (<div>
    {Object.entries(prayerRequests).map(([k, v], i) =>
      <div key={k}>
        <button
          className={`${styles.button} ${v.prayed ? styles.buttonActive : ""}`}
          aria-label="Be"
          onClick={() => {
            dispatch(
              setPrayed(k)
            )
          }}
        >Uppringd</button>
        {v.gender} - {v.name} <a href={`tel:${v.phone}`}>{v.phone}</a>
      </div>
      )}
  </div>)

  if (loggedIn) {
    return prayerList;
  } else {
    return loginForm;
  }
}

const prayerRequestComponentProps = () => ({childComponent: PrayerRequestComponent});
const prayerListComponentProps = () => ({childComponent: PrayerListComponent});

export const PrayerRequest = connect(prayerRequestComponentProps, {fetchData: fetchActive})(PrayerRequestLoader);
export const PrayerList = connect(prayerListComponentProps, {fetchData: fetchPrayerRequests})(PrayerRequestLoader);