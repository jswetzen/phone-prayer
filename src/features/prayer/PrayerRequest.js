import React, { Component, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  requestPrayer,
  fetchActive,
  fetchPrayerRequests,
  fetchAdmin,
  selectPrayerRequests,
  setPrayed,
  togglePrayed,
  doLogin,
  selectLoggedIn,
  selectActive,
  toggleActive,
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
  const [submitted, setSubmitted] = useState(false);
  const [GDPRChecked, setGDPRChecked] = useState(false);

  var result;
  if (active === null) {
    result = loadingIndicator();
  } else if (!active) {
    result =
      <div className={styles.requestForm}>
        <img className={styles.fullWidthImg} alt="Saronkyrkan logo" src="img/saronlogo.jpg" />
        <h2>Vi försöker ha förebedjare tillgänglig varje söndag.<br />Om förebedjare finns är förbönen öppen efter söndagens gudstjänst mellan 13.00 och 13.45.</h2>  
      </div>;
  } else if (submitted) {
    result =
        <div className={styles.requestForm}>
        <img className={styles.fullWidthImg} alt="Saronkyrkan logo" src="img/saronlogo.jpg" />
          <h2>En av våra förebedjare kommer att ringa upp dig inom kort</h2>
        </div>;
  } else {
    result =
        <div className={styles.requestForm}>
          <img className={styles.fullWidthImg} alt="Saronkyrkan logo" src="img/saronlogo.jpg" />
          <span className={styles.textBlock}>
            Önskar du förbön så skriv ditt namn och telefonnummer här för att bli uppringd av en förebedjare som har församlingens förtroende.
          </span>
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
          </div>
          <div className={styles.textBlock}>
            <input
              id="gdprConsent"
              type="checkbox"
              checked={GDPRChecked}
              onChange={(e) => setGDPRChecked(!GDPRChecked)} />
            <label htmlFor="gdprConsent">
              <span>
                Jag samtycker till lagring av data enligt GDPR. De uppgifter du lämnar här används endast av förebedjarna och raderas så fort ni haft kontakt.
              </span>
            </label>
          </div>
          <div>
            <button
              className={`${styles.button} ${!GDPRChecked ? styles.buttonDisabled : ""}`}
              aria-label="Jag önskar förbön"
              onClick={GDPRChecked ? () => {
                setSubmitted(true);
                dispatch(
                  requestPrayer({ name: name, phone: phone })
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

function AdminComponent() {
  const active = useSelector(selectActive);
  const loggedIn = useSelector(selectLoggedIn);
  const [password, setPassword] = useState('');
  const [GDPRChecked, setGDPRChecked] = useState(false);
  const dispatch = useDispatch();


  const loginForm = (
    <div className={styles.requestForm}>
      <h1>Ange lösenord för förebedjare</h1>
      <input
        className={styles.fullWidthInput}
        aria-label="Lösenord"
        id="password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={styles.consentBox}>
        <input
          id="gdprConsent"
          type="checkbox"
          checked={GDPRChecked}
          onChange={(e) => setGDPRChecked(!GDPRChecked)} />
        <label htmlFor="gdprConsent">
          <span>
            Jag samtycker till användandet av kakor för att spara inloggningen.
          </span>
        </label>
      </div>
      <button
        className={`${styles.button} ${!GDPRChecked ? styles.buttonDisabled : ""}`}
        aria-label="Logga in"
        onClick={GDPRChecked ? () => {
          dispatch(
            doLogin(password)
          );
        } : () => {}}
      >Logga in</button>
    </div>
  );

  const buttonText = active ? "Stäng förbönen" : "Öppna förbönen";

  const adminInterface = (
    <div>
      <h1>Förbönen är {active ? "öppen" : "stängd"}</h1>
      <button
        className={`${styles.button} ${active ? styles.buttonDisabled : ""}`}
        aria-label={buttonText}
        onClick={() => {
          dispatch(
            toggleActive(!active)
          );
        }}
      >{buttonText}</button>
    </div>
  );

  if (loggedIn === null) {
    return loadingIndicator();
  } else if (loggedIn) {
    return adminInterface;
  } else {
    return loginForm;
  }
}

export function PrayerListComponent() {
  const prayerRequests = useSelector(selectPrayerRequests);
  const loggedIn = useSelector(selectLoggedIn);
  const [password, setPassword] = useState('');
  const [GDPRChecked, setGDPRChecked] = useState(false);
  const dispatch = useDispatch();

  const sortRequests = ([k1, v1], [k2, v2]) => {
    if (v1.requestTime > v2.requestTime) {
      return 1;
    } else {
      return -1;
    }
  };

  const loginForm = (
    <div className={styles.requestForm}>
      <h1>Ange lösenord för förebedjare</h1>
      <input
        className={styles.fullWidthInput}
        aria-label="Lösenord"
        id="password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className={styles.consentBox}>
        <input
          id="gdprConsent"
          type="checkbox"
          checked={GDPRChecked}
          onChange={(e) => setGDPRChecked(!GDPRChecked)} />
        <label htmlFor="gdprConsent">
          <span>
            Jag samtycker till lagring av IP-adress samt webbläsarversion i fem dagar för att spara inloggningen.
            Saron använder Googles databastjänst Firebase.
          </span>
        </label>
      </div>
      <button
        className={`${styles.button} ${!GDPRChecked ? styles.buttonDisabled : ""}`}
        aria-label="Logga in"
        onClick={GDPRChecked ? () => {
          dispatch(
            doLogin(password)
          );
        } : () => {}}
      >Logga in</button>
    </div>
  );

  const prayerList = (<div>
    {Object.entries(prayerRequests).sort(sortRequests).map(([k, v], i) =>
      <div key={k} className={styles.prayerRequestItem}>
        <button
          className={` ${styles.prayedButton} ${styles.button} ${v.prayedTime !== 0 ? styles.buttonActive : ""}`}
          aria-label="Be"
          onClick={() => {
            dispatch(
              togglePrayed(k)
            )
          }}
        ><span role="img" aria-label="Ring">📞</span></button>
        <div>
          <div className={styles.name}>{v.name}</div>
          <div className={styles.phone}>
            <a className={v.prayedTime !== 0 ? styles.disableLink : ""}
              href={`tel:${v.phone}`}
              onClick={() => {dispatch(setPrayed(k))}}
            >{v.phone}</a></div>
          </div>
        </div>
      )}
  </div>)

  if (loggedIn === null) {
    return loadingIndicator();
  } else if (loggedIn) {
    if (Object.entries(prayerRequests).length === 0) {
      return <div className={styles.prayerRequestPlaceholder}>
        Här var det tomt ¯\_(ツ)_/¯
      </div>
    } else {
      return prayerList;
    }
  } else {
    return loginForm;
  }
}

const adminComponentProps = () => ({childComponent: AdminComponent});
const prayerRequestComponentProps = () => ({childComponent: PrayerRequestComponent});
const prayerListComponentProps = () => ({childComponent: PrayerListComponent});

export const PrayerRequest = connect(prayerRequestComponentProps, {fetchData: fetchActive})(PrayerRequestLoader);
export const PrayerAdmin = connect(adminComponentProps, {fetchData: fetchAdmin})(PrayerRequestLoader);
export const PrayerList = connect(prayerListComponentProps, {fetchData: fetchPrayerRequests})(PrayerRequestLoader);
