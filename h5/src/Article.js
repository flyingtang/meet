import React from  "react"

import {message} from "antd-mobile"
import styles from  "./Article.less"
import * as api from "./utils/request"
import "./imageload"
const prefixUrl = "/article"


export default class Article extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            article : {},
        }
        
    }

    fetch = async (url) => {
        this.setState({isLoading:true})
        const res =  await api.find(url)
        if (res && res.data) {
            console.log(res)
            this.setState({article: res.data})
        }
     }

    componentDidMount(){
        const id = this.props.match.params && this.props.match.params.id;
       if (id){
            this.fetch(`${prefixUrl}/${id}`)
        }
    }
    render() {
        console.log(this,"1919191")
        const {article:{title, mainPic, description, createdAt, id, content}={}} = this.state;
        return (
            <div className={styles["article"]}>
                <div className={styles["header"]}>{title}</div>
                <div className={styles["body"]}  dangerouslySetInnerHTML={{ __html: content}}></div>
            </div>
        )
    }
}