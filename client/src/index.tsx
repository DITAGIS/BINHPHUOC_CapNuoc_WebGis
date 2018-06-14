import './modules/mapConfig';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers/reducers';
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';
import './css/main.scss';
let store = createStore(reducers
  // , (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
import Index from './pages/index';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#0785e4b0',
    primary2Color: '#89ccff',
    primary3Color: '#0070c5',

  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Index />
    </MuiThemeProvider>
  </Provider>,
  document.querySelector('#root'));
