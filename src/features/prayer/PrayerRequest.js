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
import loaderStyles from './Loader.module.css';

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

const loadingIndicator = () => (
  <div className={loaderStyles.ldsHeart}><div></div></div>);

export function PrayerRequestComponent() {
  const dispatch = useDispatch();
  const active = useSelector(selectActive);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [GDPRChecked, setGDPRChecked] = useState(false);

  var result;
  if (active === null) {
    result = loadingIndicator();
  } else if (!active) {
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
        <div className={styles.requestForm}>
          <img className={styles.fullWidthImg} alt="Saronkyrkan logo" src="img/saronlogo.jpg" />
          <div>
            <input
              className={styles.fullWidthInput}
              aria-label="Namn"
              id="name"
              placeholder="Namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              className={styles.fullWidthInput}
              aria-label="Telefonnummer"
              id="phone"
              placeholder="Telefonnummer"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <br />
            <select className={styles.fullWidthInput} id="gender" value={gender} required onChange={(e) => setGender(e.target.value)}>
              <option value="" disabled hidden>Kön</option>
              <option value="female">Kvinna</option>
              <option value="male">Man</option>
              <option value="other">Annat (t.ex. par)</option>
            </select>
          </div>
          <div className={styles.consentBox}>
            <input
              id="gdprConsent"
              type="checkbox"
              checked={GDPRChecked}
              onChange={(e) => setGDPRChecked(!GDPRChecked)} />
            <label htmlFor="gdprConsent">
              <span>Jag samtycker till lagring av uppgifter i Googles Firebase i enlighet med Sarons policy för personuppgifter.</span>
            </label>
          </div>
          <div>
            <button
              className={`${styles.button} ${!GDPRChecked ? styles.buttonDisabled : ""}`}
              aria-label="Jag önskar förbön"
              onClick={GDPRChecked ? () => {
                setSubmitted(true);
                dispatch(
                  requestPrayer({ name: name, gender: gender, phone: phone })
                );
              } : () => {}}
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

  const decodeGender = (text) => {
    switch (text) {
      case "male": return "♂";
      case "female": return "♀";
      default: return "?";
    }
  }

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
      <div key={k} className={styles.prayerRequestItem}>
        <button
          className={` ${styles.prayedButton} ${styles.button} ${v.prayed ? styles.buttonActive : ""}`}
          aria-label="Be"
          onClick={() => {
            dispatch(
              setPrayed(k)
            )
          }}
        ><span role="img" aria-label="Ring">📞</span></button>
        <div className={styles.gender}>{decodeGender(v.gender)}</div>
        <div>
          <div className={styles.name}>{v.name}</div>
          <div className={styles.phone}>
            <a href={`tel:${v.phone}`}
              onClick={() => {dispatch(setPrayed(k))}}
            >{v.phone}</a></div>
          </div>
        </div>
      )}
  </div>)

  if (loggedIn === null) {
    return loadingIndicator();
  } else if (loggedIn) {
    return prayerList;
  } else {
    return loginForm;
  }
}

const prayerRequestComponentProps = () => ({childComponent: PrayerRequestComponent});
const prayerListComponentProps = () => ({childComponent: PrayerListComponent});

export const PrayerRequest = connect(prayerRequestComponentProps, {fetchData: fetchActive})(PrayerRequestLoader);
export const PrayerList = connect(prayerListComponentProps, {fetchData: fetchPrayerRequests})(PrayerRequestLoader);