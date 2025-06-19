import './App.css';
// import Screen3 from "./Screen3.tsx";
// import Test from "./Test.tsx";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Layout} from "antd";
import ListPage from "./ListPage.tsx";

function App() {
    return (
        <Router >
            <Layout>
                <Switch>
                    {/*<Route exact path="/home" component={Screen3} />*/}
                    {/*<Route exact path="/s" component={Screen3} />*/}
                    {/*<Route path="/download#*" component={Screen3} />*/}
                    {/*<Route path="/work/:source" component={Screen3} />*/}
                    <Route path="*" component={ListPage} />
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
