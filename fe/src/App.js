import './App.css';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';

function App() {
  return (
    <div>
      <Routes>
        {
          routes.map((item) => {
            return (
              <Route key={item.id} path={item.path} element={item.main()} />
            )
          })
        }
      </Routes>
    </div>
  )
}

export default App;
