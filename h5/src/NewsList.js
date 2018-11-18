import React from "react"
import { ListView , WingBlank, WhiteSpace} from 'antd-mobile';
import ReactDOM from "react-dom"

import * as api from "./utils/request"
import moment from "moment"
import "./CartItem.css"
const prefixUrl = "/article"


function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0) {
  for (let i = 0; i < NUM_SECTIONS; i++) {
    const ii = (pIndex * NUM_SECTIONS) + i;
    const sectionName = `Section ${ii}`;
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[ii] = [];

    for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
      const rowName = `S${ii}, R${jj}`;
      rowIDs[ii].push(rowName);
      dataBlobs[rowName] = rowName;
    }
  }
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      height: document.documentElement.clientHeight * 3 / 4,
      data: [],
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    // setTimeout(() => {
    //   genData();
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
    //     isLoading: false,
    //     height: hei,
    //   });
    // }, 600);

    this.fetch(prefixUrl,{page: pageIndex+1})
  }

  fetch = async (url,filter) => {
    this.setState({isLoading:true})
    const res =  await api.find(url, filter)
    if (res && res.data) {
        const  data = (this.state.data).concat(res.data)
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        genData(pageIndex++);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          height: hei,
            data
          });
    }
    this.setState({isLoading:false})
 }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.dataSource !== this.props.dataSource) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
  //     });
  //   }
  // }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);

    this.fetch(prefixUrl,{page: pageIndex+1})

    // this.setState({ isLoading: true });
    // setTimeout(() => {
    //   genData(++pageIndex);
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
    //     isLoading: false,
    //   });
    // }, 1000);
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
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      console.log(rowData, sectionID, rowID)
      const item= data[rowID];
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
        // renderHeader={() => <span>header</span>}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
          {this.state.isLoading ? 'Loading...' : 'Loaded'}
        </div>)}
        // renderBodyComponent={() => <MyBody />}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height: this.state.height,
          overflow: 'auto',
        }}
        pageSize={4}
        onScroll={() => { console.log('scroll'); }}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
  }
}