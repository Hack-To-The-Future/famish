import Game from "./components/Game";
import logo from "./images/logo.png";
import "./App.css";

function App() {
  return (
    <>
      <div className="logo-container">
        <img className="logo" src={logo} alt="logo" />
      </div>
      <Game />
    </>
  );
}

export default App;
