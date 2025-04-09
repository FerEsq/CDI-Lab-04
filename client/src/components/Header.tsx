import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAppState } from '../store/slices/appState-slice';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants';

//Definición de colores de la paleta
const colors = {
  primary: '#226946',    //Dartmouth green
  secondary: '#91b4a3',  //Cambridge Blue
  white: '#ffffff',      //White
  dark: '#0d0b0c',       //Night
  accent: '#48284a'      //Violet (JTC)
};

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setAppState('NOT_LOGGED_IN'));
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  };

  return (
    <header style={{
      backgroundColor: colors.primary,
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: colors.white,
      width: '100%',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000
    }}>
      {/* Contenedor centrado con ancho máximo */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {/* Espacio izquierdo para equilibrar */}
        <div style={{ width: '120px' }}></div>

        {/* Enlaces de navegación */}
        <nav style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            color: colors.white,
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Subir archivo
          </Link>
          <Link to="/files" style={{
            color: colors.white,
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Ver archivos
          </Link>
          <Link to="/verify" style={{
            color: colors.white,
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Verificar Firma
          </Link>
        </nav>

        {/* Botón de cerrar sesión */}
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: 'none',
            borderRadius: '25px',
            padding: '6px 18px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;