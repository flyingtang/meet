
import React from 'react';
// import "./.css"

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as api from "./utils/request"
const prefixUrl = "/article"
export default class HomePage extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            list :[],
        }
    }

    componentDidMount(){
        this.fetch(prefixUrl, {page:1})
    }

    fetch = async (url,filter) => {
      const res =  await api.find(url, filter)
      if (res && res.data) {
          this.setState({list: res.data})
      }
    }
    render(){
        const {list} = this.state
        return (
            <div>
                123
            </div>
        )
    }
}