import React from "react"
import { ListView , WingBlank, WhiteSpace} from 'antd-mobile';

import * as api from "./utils/request"
import moment from "moment"
import "./CartItem.css"
const prefixUrl = "/article"




    const NUM_ROWS = 10;
    let pageIndex = 0;
    
    function genData(pIndex = 0) {
        const dataBlob = {};
        for (let i = 0; i < NUM_ROWS; i++) {
          const ii = (pIndex * NUM_ROWS) + i;
          dataBlob[`${ii}`] = `row - ${ii}`;
        }
        return dataBlob;
      }

export default class NewsList extends React.Component {
      constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        });
    
        this.state = {
          dataSource: dataSource.cloneWithRows({}),
          isLoading: true,
          data: [],
        };
        this.rData = {}
      }
    
      componentDidMount() {
        this.fetch(prefixUrl,{page: pageIndex+1})
      }


    fetch = async (url,filter) => {
        this.setState({isLoading:true})
        const res =  await api.find(url, filter)
        if (res && res.data) {
            const  data = (this.state.data).concat(res.data)
            this.rData = { ...this.rData, ...genData(pageIndex) };
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                data
              });
        }
        this.setState({isLoading:false})
     }
        
     onEndReachedHandle = (event) => {
          console.log(123,"2323")
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        console.log('reach end', event);
        this.fetch(prefixUrl,{page: pageIndex})
      }


      render() {
        const separator = (sectionID, rowID) => (
          <div
            key={`${sectionID}-${rowID}`}
            style={{
              backgroundColor: '#F5F5F9',
              height: 8,
              borderTop: '1px solid #ECECED',
              borderBottom: '1px solid #ECECED',
            }}
          />
        );
        const row = (rowData, sectionID, rowID) => {
            console.log( rowData, sectionID, rowID, "abc")
            const item = this.state.data[rowID]
          return (
            <div key={rowID} style={{ padding: '0 15px' }}>
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
            </div>
          );
        };
        return (
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={row}
            renderSeparator={separator}
            className="am-list"
            pageSize={4}
            useBodyScroll
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={()=>console.log("laodaoz")}
            initialListSize={this.state.dataSource.length - 4}
            onEndReachedThreshold={100}
            scrollEventThrottle={30}
          />
        );
      }
    }