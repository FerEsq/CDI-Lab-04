import { useDispatch } from 'react-redux';
import { setAppState } from '../store/slices/appState-slice';
import { TOKEN_COOKIE_NAME } from '../utils/constants';
import Cookies from 'js-cookie';

const Home = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home; 