import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Card, Button, Colors, TabBar, } from 'react-native-ui-lib';
import { SafeAreaViewPlus, OneToast, Header, Empty, Rows, NoticeTodoItem, RepairItem, UpkeepItem, CheckItem, SpareReviewItem, SpareChangeMissionItem, Modal, SubmitForm } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../utils';
import { ProgressCircle } from 'react-native-svg-charts'
import moment from 'moment';
import { ECharts } from "react-native-echarts-wrapper";

let { height, width } = Dimensions.get('window');

let option = [
  {
    dicName: "全部",
    dicKey: "1",
    color: colors.textColor
  },
  {
    dicName: "我的发布(审核)",
    dicKey: "2",
    color: colors.primaryColor
  },
  {
    dicName: "任务通知(未完成)",
    dicKey: "3",
    color: Colors.green30,
  },
  {
    dicName: "我的维修(未完成)",
    dicKey: "4",
    color: Colors.green30,
  },
  {
    dicName: "我的维保(未完成)",
    dicKey: "5",
    color: Colors.green30,
  },
  {
    dicName: "我的点检(异常待处理)",
    dicKey: "6",
    color: "#F50",
  },
  {
    dicName: "我的备件(审批)",
    dicKey: "7",
    color: colors.primaryColor,
  },
  {
    dicName: "我的备件(更换任务)",
    dicKey: "8",
    color: Colors.blue20,
  },
], timeline = ["周", "月", "季", "半年", "年"]
@connect(({ index, loading }) => ({ index, loading }))
class Home extends React.Component {
  state = {
    progress: 0,
    fullscreen: false,
    selectedIndex: 0,
    visible: false,
    xAxis: [],
    yAxis: [],
    postDatas: [
      {
        "departmentId": "",//部门id，筛选条件
        "shopId": "",// 车间id，筛选条件
        "unit": "周"//时间，筛选条件
      },
      {
        "departmentId": "",//部门id，筛选条件
        "shopId": "",// 车间id，筛选条件
        "unit": "周"//时间，筛选条件
      },
      {
        "departmentId": "",//部门id，筛选条件
        "shopId": "",// 车间id，筛选条件
        "unit": "周"//时间，筛选条件
      },
      {
        "departmentId": "",//部门id，筛选条件
        "shopId": "",// 车间id，筛选条件
        "unit": "周"//时间，筛选条件
      },
    ]



  }


  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'index/' + type,
      payload: values
    }).then((res) => {
      if (!res) {
        return
      }
      fn ? fn() : null
    })
  }

  componentDidMount() {
    this.setNewState("homenum", null, () => {
      let { homenum: { turnOnRate } } = this.props.index;
      this.setState({
        progress: turnOnRate / 100
      })
    })
    this.setNewState("overview", { taskType: "1" });
    this.getChartData()
  }

  getoption = () => {
    let { index: { chartdata } } = this.props;
    let { dataList } = chartdata ? chartdata : { dataList: [] };
    let xData = dataList && dataList.map((item) => {
      return item.date
    }), yData = dataList && dataList.map((item) => {
      return item.value
    })
    return {
      grid: [
        { x: '13%', y: '13%', width: '85%', height: '60%' },
      ],
      tooltip: {
        trigger: 'axis',
      },
      dataZoom: [{
        type: 'inside'
      }, {
        type: 'slider'
      }],
      xAxis: [
        {
          type: 'category',
          data: xData,
          boundaryGap: false,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: "占比",
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      series: [
        {
          name: "占比",
          type: 'line',
          data: yData,
          itemStyle: {
            normal: {
              color: colors.primaryColor
            }
          }
        }
      ]
    }
  }

  getChartData() {
    let { postDatas, selectedIndex } = this.state;
    switch (selectedIndex) {
      case 0:
        this.setNewState("queryOEE", postDatas[selectedIndex], () => {
          this.chart && this.chart.setOption(this.getoption());
        })
        break;
      case 1:
        this.setNewState("queryJIA", postDatas[selectedIndex], () => {
          this.chart && this.chart.setOption(this.getoption());
        })
        break;
      case 2:
        this.setNewState("queryMTTR", postDatas[selectedIndex], () => {
          this.chart && this.chart.setOption(this.getoption());
        })
        break;
      case 3:
        this.setNewState("queryMTBF", postDatas[selectedIndex], () => {
          this.chart && this.chart.setOption(this.getoption());
        })
        break;
      default:
        this.setNewState("queryOEE", postDatas[selectedIndex], () => {
          this.chart && this.chart.setOption(this.getoption());
        })
        break
    }
  }

  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };


  render() {
    const { index: { homenum, overview, chartdata }, navigation, loading } = this.props,
      { progress, fullscreen, selectedIndex, visible, postDatas } = this.state;
    let getColor = (item) => {
      let color = "#43c4cc"
      switch (item) {
        case "待机":
          color = "#ffcb01";
          break;
        case "运行中":
          color = "#5477ff";
          break;
        case "故障":
          color = "#cc0d01";
          break;
        case "维修中":
          color = "#43c4cc";
          break;
        case "流转中":
          color = "#54bbff";
          break;
        case "报废":
          color = "#999999";
          break;
      }
      return color
    }, renderItem = (item, i) => {
      let dicName = option.filter((it) => { return it.dicKey == item.taskType })[0].dicName,
        color = option.filter((it) => { return it.dicKey == item.taskType })[0].color;
      if (item.taskType == "2") {
        return <View bg-white marginB-1>
          <NoticeTodoItem item={item} navigation={this.props.navigation} type="history" hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </NoticeTodoItem>
        </View>
      } else if (item.taskType == "3") {
        return <View bg-white marginB-1>
          <NoticeTodoItem item={item} navigation={this.props.navigation} type="history" hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </NoticeTodoItem>
        </View>
      } else if (item.taskType == "4") {
        return <View bg-white marginB-1>
          <RepairItem pressfn={() => {
            navigation.navigate("RepairAction", { title: "开始维修", type: item.status.toString(), id: item.equipmentId })
          }} item={item} navigation={this.props.navigation} hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </RepairItem>
        </View>
      } else if (item.taskType == "5") {
        return <View bg-white marginB-1>
          <UpkeepItem item={item} navigation={this.props.navigation} type="mission" hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </UpkeepItem>
        </View>
      } else if (item.taskType == "6") {
        return <View bg-white marginB-1>
          <CheckItem item={item} navigation={this.props.navigation} type="error" hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </CheckItem>
        </View>
      } else if (item.taskType == "7") {
        return <View bg-white marginB-1>
          <SpareReviewItem item={item} navigation={this.props.navigation} hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </SpareReviewItem>
        </View>
      } else if (item.taskType == "8") {
        return <View bg-white marginB-1>
          <SpareChangeMissionItem item={item} navigation={this.props.navigation} hidden={true}>
            <Rows padding={0} name={dicName} rightRender={<Text>{item.createTime}</Text>} color={color} noborder={true}></Rows>
          </SpareChangeMissionItem>
        </View>
      }
    }


    return <SafeAreaViewPlus loading={loading.effects['index/homenum'] || loading.effects['index/overview']}>
      <Header
        title="首页"
        headerLeft={() => {
          return <AntIcons name={'menuunfold'} size={20} style={{ color: "#666" }} onPress={() => {
            navigation.openDrawer()
          }}></AntIcons>
        }}
        headerRight={() => {
          return <Ionicons name={'ios-qr-scanner'} size={22} onPress={() => {
            navigation.navigate("Scan")
          }}></Ionicons>
        }}
      >
      </Header>
      <Modal
        visible={visible}
        height={height * 0.75}
        hide={() => {
          this.setState({
            visible: false
          })
        }}
        title={"请选择部门/车间"}
      >
        <View style={{ backgroundColor: "#f0f0f0" }} flex-1>
          <View flex-1 padding-12>
            <SubmitForm></SubmitForm>
          </View>
          <Button label="确认" margin-12 marginT-0></Button>
        </View>
      </Modal>

      <ScrollView keyboardShouldPersistTaps="handled">
        <View bg-white margin-12 style={{ borderRadius: 8 }}>
          <View row center paddingV-12>
            <View flex-1 row center>
              <FontAwesome name="laptop" size={60} style={{ color: colors.primaryColor }}></FontAwesome>
              <View center paddingL-8>
                <Text body>设备总数</Text>
                <Text heading style={{ color: colors.primaryColor }}>{homenum.equipmentCount}</Text>
              </View>
            </View>
            <View bg-dark60 width={1} height={40}></View>
            <View row center flex-1>
              <ProgressCircle
                style={{ height: 40, width: 40 }}
                progress={progress}
                progressColor={Colors.green30}
                animate={true}
              />
              <View center paddingL-12>
                <Text body>开机率</Text>
                <Text heading style={{ color: Colors.green30 }}>{homenum.turnOnRate}%</Text>
              </View>
            </View>
          </View>
          <View row center padding-4 paddingB-12>
            {
              homenum.equipStatusChart && homenum.equipStatusChart.length > 0 ?
                homenum.equipStatusChart.map((item, i) => {
                  return (
                    <Card margin-4 center flex-1 enableShadow={false}>
                      <Card marginB-4 center width={30} height={30} enableShadow={false} style={{ borderColor: getColor(item.name), borderWidth: 1, borderRadius: 60 }}>
                        <Text style={{ color: getColor(item.name) }}>{item.value}</Text>
                      </Card>
                      <Text style={{ fontSize: 11 }}>{item.name}</Text>
                    </Card>
                  )
                }) : <Empty></Empty>
            }
          </View>
        </View>

        <View marginH-12 bg-white style={{ borderRadius: 8, overflow: "hidden" }}>
          <TabBar
            selectedIndex={this.state.selectedIndex}
            onChangeIndex={index => {
              //this.scrollview.scrollTo({ x: 0, y: 720, animated: true }, 1)
              this.setState({ selectedIndex: index }, () => {
                this.getChartData()
              })
            }}
            style={styles.tabbar}
            enableShadow={false}
            indicatorStyle={{ borderBottomWidth: 2, borderColor: colors.primaryColor }}>
            <TabBar.Item
              label={`OEE图表`}
              labelStyle={{ textTransform: 'capitalize' }}
              selectedLabelStyle={{
                color: colors.primaryColor
              }}
            />
            <TabBar.Item selectedLabelColor={colors.primaryColor}
              label={`稼动率图表`}
              labelStyle={{ textTransform: 'capitalize' }}
              selectedLabelStyle={{
                color: colors.primaryColor
              }}
            />
            <TabBar.Item selectedLabelColor={colors.primaryColor}
              label={`MTTR图表`}
              labelStyle={{ textTransform: 'capitalize' }}
              selectedLabelStyle={{
                color: colors.primaryColor
              }}
            />
            <TabBar.Item selectedLabelColor={colors.primaryColor}
              label={`MTBF图表`}
              labelStyle={{ textTransform: 'capitalize' }}
              selectedLabelStyle={{
                color: colors.primaryColor
              }}
            />
          </TabBar>
          <View style={{ borderColor: "#f0f0f0", borderTopWidth: 1 }}>
            <Card center padding-12 style={{ borderColor: "#f0f0f0", borderBottomWidth: 1 }} enableShadow={false} onPress={() => {
              let submitdata = [
                {
                  key: "departmentId",
                  type: "treeselect",
                  require: true,
                  value: "",
                  collspan:true,
                  placeholder: "请选择部门",
                  option: chartdata.departmentList && chartdata.departmentList
                }, {
                  key: "shopId",
                  type: "select",
                  require: true,
                  value: "",
                  width: "31%",
                  placeholder: "请选择车间",
                  collspan:true,
                  option: chartdata.shopList && chartdata.shopList.map((item, i) => {
                    return {
                      dicName: item.shopName,
                      dicKey: item.id
                    }
                  })
                }
              ]
              this.setNewState("submitdata", submitdata, () => {
                this.setState({
                  visible: true
                })
              })


            }}>
              <Text>
                选择部门/车间
              </Text>
            </Card>
            <View style={styles.chartContainer} padding-10 paddingB-0>
              <ECharts
                ref={this.onRef}
                option={this.getoption()}
              />
            </View>
            <View row>
              {
                timeline.map((item) => {
                  return <Card flex-1 style={{ backgroundColor: postDatas[selectedIndex].unit == item ? "#FFFFFF" : "#ddd", borderRadius: 0 }} enableShadow={false} center padding-12 onPress={() => {
                    let newpostDatas = postDatas.map((it, i) => {
                      if (selectedIndex == i) {
                        it.unit = item
                      }
                      return it
                    })

                    this.setState({
                      postDatas: newpostDatas
                    }, () => {
                      this.getChartData()
                    })

                  }}>
                    <Text>{item}</Text>
                  </Card>

                })
              }

            </View>
          </View>
        </View>


        <View marginH-12 marginT-12 style={{ borderRadius: 8, overflow: "hidden" }}>
          <Card row spread paddingB-12 style={{ alignItems: "center", backgroundColor: "transparent" }} enableShadow={false} onPress={() => {
            this.setState({
              fullscreen: !fullscreen
            })
          }}>
            <Text>待办任务({overview.taskList ? overview.taskList.length : ""}):</Text>
          </Card>
          <View style={{ borderRadius: 8, overflow: "hidden" }}>
            {
              overview.taskList && overview.taskList.length > 0 ?
                overview.taskList.sort((a, b) => {
                  return moment(b.createTime).valueOf() - moment(a.createTime).valueOf()
                }).map((item, i) => {
                  if (fullscreen) {
                    return renderItem(item, i)
                  } else if (i < 3) {
                    return renderItem(item, i)
                  }
                }) :
                null
            }
            {
              overview.taskList && overview.taskList.length > 3 ? <Card row center padding-4 borderRadius={0} enableShadow={false} onPress={() => {
                this.setState({
                  fullscreen: !fullscreen
                })
              }}>
                <AntIcons name={fullscreen ? "arrowup" : "arrowdown"} size={16} style={{ color: colors.primaryColor }}></AntIcons>
                <Text>
                  {fullscreen ? " 收起" : " 展开"}
                </Text>
              </Card> : null
            }
          </View>
        </View>




      </ScrollView>



    </SafeAreaViewPlus>

  }
}


const styles = StyleSheet.create({
  tabbar: {
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chartContainer: {
    height: 254,
  }

})


export default Home