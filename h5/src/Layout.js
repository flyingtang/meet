import React from 'react';
import "./Layout.css"
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home"
import NewsList from  "./NewsList"
import ArticleList from "./Article"
import {menus} from "./menus.json"

export default class Layout extends React.Component {
      state = {
        open: false,
      }
      onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
      }
      render() {
        // fix in codepen
        const sidebar = (<List>
          {menus.map((i, index) => {
            if (index === 0) {
              return (<List.Item key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                multipleLine
              ><Link to={i.path}>{i.name}</Link></List.Item>);
            }
            return (<List.Item key={index}
              thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            ><Link to={i.path}>{i.name}</Link></List.Item>);
          })}
        </List>);
    
        return (
        <Router>
            <div>
            <NavBar icon={<Icon type="ellipsis" />} onLeftClick={this.onOpenChange}>我的地盘</NavBar>
            <Drawer
                className="my-drawer"
                style={{ minHeight: document.documentElement.clientHeight }}
                enableDragHandle
                contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                sidebar={sidebar}
                open={this.state.open}
                onOpenChange={this.onOpenChange}
            >
                <Route exact path="/" component={Home} />
                <Route  path="/news" component={NewsList} />
                <Route  path="/articles" component={ArticleList} />
            </Drawer>
        </div>
        </Router>
        );
      }
}

