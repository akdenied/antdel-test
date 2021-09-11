import { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
// routes
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import axios from './utils/axios';
import routes from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { getUserProfile } from './actions/auth/auth';
// import { setAuthToken } from './utils/axios';

// ----------------------------------------------------------------------
// if (localStorage.token) {
//   setAuthToken(localStorage.token);
// }

export default function App() {
  const auth = useSelector((state) => state.auth);
  const routing = useRoutes(routes(auth));
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard/app');
    }
    const { token } = localStorage;
    if (token) {
      dispatch(getUserProfile).then((res) => {
        console.log(`res`, res);
      });
    }
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/dashboard/app');
    }
  }, [auth]);

  if (auth.loading)
    return (
      <div className={classes.loader}>
        <CircularProgress disableShrink />
      </div>
    );

  return (
    <ThemeConfig>
      <ScrollToTop />
      {routing}
    </ThemeConfig>
  );
}

const useStyles = makeStyles({
  loader: {
    width: '100%',
    height: 'calc(100vh - 20px);',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
