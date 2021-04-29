import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import "./App.css";
import Login from "./screens/Login-form/Login";
import Register from "./screens/Register-form/Register";

function App() {
    // local storage
    const myStorage = window.localStorage;
    const [viewport, setViewport] = useState({
        width: "100%",
        height: "100%",
        latitude: 29.625996,
        longitude: 74.287491,
        zoom: 5,
    });
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [pins, setPins] = useState([]);

    // for adding new place states--->
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);

    // for popup models
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long, zoom: 8 });
    };
    const handleClick = (e) => {
        const [long, lat] = e.lngLat;
        currentUser === null
            ? setShowLogin(true)
            : setNewPlace({
                  lat: lat,
                  long: long,
              });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        };
        try {
            const res = await axios.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    };
    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null);
        console.log("Logged out successfully");
    };
    return (
        <div className="app">
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapStyle={
                    "mapbox://styles/vaibhav7899/cko2emzhu0beu18liq9tqnz04"
                }
                onDblClick={handleClick}
                transitionDuration="300"
            >
                {pins.map((p) => {
                    return (
                        <div key={p._id}>
                            <Marker
                                latitude={p.lat}
                                longitude={p.long}
                                offsetLeft={-viewport.zoom * 3.5}
                                offsetTop={-viewport.zoom * 7}
                            >
                                <Room
                                    onClick={() => {
                                        handleMarkerClick(p._id, p.lat, p.long);
                                    }}
                                    style={{
                                        fontSize: viewport.zoom * 7,
                                        cursor: "pointer",
                                        color:
                                            p.username === currentUser
                                                ? "#61E8E1"
                                                : "#EF8A17",
                                    }}
                                />
                            </Marker>

                            {currentUser !== null && p._id === currentPlaceId && (
                                <Popup
                                    latitude={p.lat}
                                    longitude={p.long}
                                    closeButton={true}
                                    closeOnClick={false}
                                    onClose={() => setCurrentPlaceId(null)}
                                    anchor="right"
                                    className="popup"
                                >
                                    <div className="card">
                                        <p className="place">{p.title}</p>
                                        <div className="review__wrapper">
                                            <label className="xtra">
                                                Review
                                            </label>
                                            <p className="desc">{p.desc}</p>
                                        </div>

                                        <label>Rating</label>
                                        <div className="star__wrapper">
                                            {Array(p.rating).fill(
                                                <Star className="star" />
                                            )}
                                        </div>
                                        <div className="info">
                                            <span>
                                                Creatd by <b>{p.username}</b>
                                            </span>
                                            <span className="date">
                                                {format(p.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            )}
                            {newPlace && (
                                <Popup
                                    latitude={newPlace.lat}
                                    longitude={newPlace.long}
                                    closeButton={true}
                                    closeOnClick={false}
                                    onClose={() => setNewPlace(null)}
                                    anchor="right"
                                >
                                    <div>
                                        <form onSubmit={handleSubmit}>
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                placeholder="Enter a tittle"
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                }}
                                            />
                                            <label>Review</label>
                                            <textarea
                                                placeholder="Share your thoughts and experience about this place"
                                                onChange={(e) => {
                                                    setDesc(e.target.value);
                                                }}
                                            ></textarea>
                                            <label>Rating</label>
                                            <select
                                                onChange={(e) => {
                                                    setRating(e.target.value);
                                                }}
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                            <button
                                                className="submit-button"
                                                type="submit"
                                            >
                                                Create Pin
                                            </button>
                                        </form>
                                    </div>
                                </Popup>
                            )}
                        </div>
                    );
                })}
                {currentUser ? (
                    <button className="btn logout" onClick={handleLogout}>
                        Log out
                    </button>
                ) : (
                    <div className="group">
                        <button
                            className="btn login"
                            onClick={() => setShowLogin(!showLogin)}
                        >
                            Login
                        </button>

                        <button
                            className="btn register"
                            onClick={() => setShowRegister(!showRegister)}
                        >
                            Register
                        </button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && (
                    <Login
                        setShowLogin={setShowLogin}
                        myStorage={myStorage}
                        setCurrentUser={setCurrentUser}
                    />
                )}
                <p className="tut">Double Click to add pin</p>
            </ReactMapGL>
        </div>
    );
}

export default App;
