import React from 'react';
import "./CartItem.css"
import { Card, WingBlank, WhiteSpace} from 'antd-mobile';
import moment from "moment"
export default function(rowData, sectionID, rowID){

    return (
        <WingBlank size="lg">
            <WhiteSpace size="lg" />
            <div className="card">
                <div><img width="100" height="80" src={item && item.mainPic}/></div>
                <div className="content">
                    <div className="title">{item && item.title}</div>
                    <div className="footer">
                        <div >{moment(item && item.createdAt).format("YYYY-MM-DD HH:mm:ss")} </div>
                        <div>{item && item.author}</div>
                    </div>
                </div>
            </div>
        </WingBlank>
    )

}
