import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAppState } from '../store/slices/appState-slice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // TODO: use isLoginLoading later for a loader
  const { handleLogin, isLoginLoading } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const onLogin = (email: string, password: string) => {
    handleLogin(
      email, 
      password, 
      ()=>{
        dispatch(setAppState('LOGGED_IN'));
        navigate(from, { replace: true });
      }
    );
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onLogin(values.email, values.password);
    },
  });



  return (
    <div>
      <h1>Login</h1>
      <div>
        <form 
          onSubmit={formik.handleSubmit} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px' 
          }}
        >
          <input 
            type="email" 
            name="email" 
            onChange={formik.handleChange} 
            value={formik.values.email} 
          />
          {formik.errors.email && 
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</div>
          }
          <input 
            type="password" 
            name="password" 
            onChange={formik.handleChange} 
            value={formik.values.password} 
          />
          {formik.errors.password && 
            <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</div>
          }
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 