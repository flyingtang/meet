import React from 'react';
import "./Layout.css"
import { Drawer, List, NavBar, Icon } from 'antd-mobile';
import {Router, Route, Link } from "react-router-dom";
import Home from "./Home"
import NewsList from  "./NewsList"
import ArticleList from "./Article"
import {menus} from "./menus.json"
import history from './history';
import Article from "./Article"

export default class Layout extends React.Component {
      state = {
        open: false,
        selectItem:{...menus[0]},
      }
      onOpenChange = (...args) => {
        this.setState({ open: !this.state.open });
      }

      onHandleSelectItem = (item) => {
        console.log(item,"999")
        this.setState({selectItem: item, open: false}, ()=>{
          history.push(item.path)
        })
      }

      render() {
        // fix in codepen
        const sidebar = (<List >
          {menus.map((i, index) => {
            console.log(i, index)
            if (index === 0) {
              return (<List.Item key={index}
                thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                multipleLine
                onClick = {this.onHandleSelectItem.bind(this,i)}
              >
              <div>{i.name}</div>
              {/* <Link to={i.path}>{i.name}</Link> */}
              </List.Item>);
            }
            return (<List.Item key={index}
              onClick = {this.onHandleSelectItem.bind(this,i)}
              thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
            >
            {/* <Link to={i.path}>{i.name}</Link> */}
            <div>{i.name}</div>
            </List.Item>);
          })}
        </List>);
        const {selectItem} = this.state;
        console.log(this, "this")
        return (
        <Router  history={history}>
            <div>
            <NavBar icon={<Icon type="ellipsis" />} onLeftClick={this.onOpenChange}>{selectItem && selectItem.name}</NavBar>
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
                <Route  path="/article/:id" component={Article} />
            </Drawer>
        </div>
        </Router>
        );
      }
}

