import Parse from "parse";

const CHURCH_ID = "saron";
const PARSE_APP_ID = "forbon";

Parse.initialize(PARSE_APP_ID);
Parse.serverURL = "https://parse.swetzen.com/parse";

export const PrayerRoom = Parse.Object.extend("PrayerRoom");
export const PrayerRequest = Parse.Object.extend("PrayerRequest");

export const activeQuery = () => {
    const query = new Parse.Query(PrayerRoom);
    query.equalTo("churchId", CHURCH_ID);
    return query;
}

export const onActiveQueryFetchOrChange = (handle) => {
  activeQuery().first().then((prayerRoom) => {
    handle(prayerRoom.get('active'));
  });

  activeQuery().subscribe().then((subscription) => {
    subscription.on('update', (prayerRoom) => {
      handle(prayerRoom.get('active'));
    });
  });
};

export const requestsQuery = () => new Parse.Query(PrayerRequest).equalTo("churchId", CHURCH_ID);
export const getPrayerRequest = (requestId)  => new Parse.Query(PrayerRequest).get(requestId);

const requestToObject = (request) => ({
    id: request.id,
    name: request.get("name"),
    phone: request.get("phone"),
    requestTime: + request.get("requestTime"),
    prayedTime: + request.get("prayedTime"),
});

export const onRequestQueryFetchOrUpdate = (handle)  => {
    requestsQuery().find().then((requests) => {
        handle(requests.map(requestToObject));
    });

    requestsQuery().subscribe().then((subscription) => {
        subscription.on("create", (request) =>
            handle([requestToObject(request)]));
        subscription.on("update", (request) =>
            handle([requestToObject(request)]));
    });
};

export const currentUser = () => Parse.User.currentAsync();
export const signIn = (password) => Parse.User.logIn("forbon", password);