import React, { Component, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  requestPrayer,
  fetchPrayerRequests,
} from './prayerSlice';
import styles from './Counter.module.css';

class PrayerRequestLoader extends Component {
    componentDidMount() {
        this.props.fetchPrayerRequests();
    }

    render() {
        return(
            <div>
                <PrayerRequestComponent />
            </div>
        )
    }
}

export function PrayerRequestComponent() {
  const dispatch = useDispatch();
  const [name, setName] = useState('Kalle');
  const [phone, setPhone] = useState('031');
  const [gender, setGender] = useState('Man');
  const [submitted, setSubmitted] = useState(false);

  var result;
  if (submitted) {
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

export const PrayerRequest = connect(null, {fetchPrayerRequests})(PrayerRequestLoader);