import { useDispatch } from 'react-redux';
import { setAppState } from '../store/slices/appState-slice';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';
import Cookies from 'js-cookie';
import { useRef, useState } from 'react';
import useFiles from '../hooks/useFiles';

const Home = () => {
  const dispatch = useDispatch();
  const fileRef = useRef<File>(null);
  const [sign, setSign] = useState(false);
  const { handleFileUpload: handleFileUploadMutation, isUploadLoading } = useFiles();

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      fileRef.current = file
    }
  };

  const handleSubmit = () => {
    const file = fileRef.current;
    if (file) {
      handleFileUploadMutation(file, sign);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <input type="file" onChange={handleFileUpload} />
      <input type="checkbox" onChange={() => setSign(!sign)} />
      <button onClick={handleSubmit}>Upload</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home; 