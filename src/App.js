import React from 'react';
import './App.css';
import { PrayerRequest, PrayerList, PrayerAdmin } from './features/prayer/PrayerRequest';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={PrayerRequest} />
          <Route path={["/förebedjare", "/forebedjare"]} component={PrayerList} />
          <Route path="/admin" component={PrayerAdmin} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
