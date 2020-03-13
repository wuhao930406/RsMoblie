import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Card, Badge, TextField, Colors, Dialog, Button, FloatingButton } from 'react-native-ui-lib';
import { SafeAreaViewPlus, OneToast, Header, Modal, TitleSearch, SpareLogItem } from '../../../components';
import AntIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { colors } from '../../../utils';
import { StyleSheet, ImageBackground, Animated } from 'react-native';
import { LargeList } from "react-native-largelist-v3";
import { ChineseWithLastDateHeader, ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import ActionButton from 'react-native-action-button';

@connect(({ index, loading }) => ({
    index,
    submitting: loading.effects['index/sparelog'],
}))
class SpareLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadMore: true,
            height: new Animated.Value(45),
            refreshing: true,
            postUrl: "sparelog",
            search: true,
            showbtn: false,
            postData: {
                "pageIndex": "1",  //--------页码*
                "pageSize": "10",  //--------每页条数*
                "sparePartsName": "",//备件名
                "sparePartsNo": "",//备件料号
                "ioType": "",//出入库类型key（入库0   出库1），筛选条件
                "dealStartTime": "",//处理开始时间，筛选条件
                "dealEndTime": "",//处理结束时间，筛选条件
            },
            resData: [{ items: [] }]
        }
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


    //获取数据
    getData() {
        this.setState({
            postData: {
                ...this.state.postData,
                pageIndex: this.state.refreshing ? 1 : this.state.postData.pageIndex
            }
        }, () => {
            let { postUrl, postData, refreshing } = this.state;
            this.setNewState(postUrl, postData, () => {
                this.setNewState("done", "0", () => {
                    this._list.endRefresh();//结束刷新状态
                    this._list.endLoading();
                    if (refreshing) {
                        this.setState({
                            resData: [{ items: this.props.index.sparelog.list }],
                            refreshing: false,
                            isLoadMore: false
                        })
                    } else {
                        this.setState({
                            resData: this.state.resData.concat([{ items: this.props.index.sparelog.list }]),
                            isLoadMore: false
                        })
                    }
                })
            })
        })
    }

    resetData = (yuan) => {
        let { index: { done, formdata } } = yuan
        function getVal(key) {
            let one = {};
            formdata.map((item) => {
                if (item.key == key) {
                    one = item
                }
            });
            if (!one.type) {
                return
            }
            if (one.type.indexOf("select") == -1) {
                return one.value && one.value
            } else {
                return one.value && one.value.id
            }
        }
        if (done == "1" && formdata.length > 0) {
            this.setState({
                postData: {
                    "pageIndex": "1",  //--------页码*
                    "pageSize": "10",  //--------每页条数*
                    "sparePartsName": getVal("sparePartsName"),//备件名
                    "sparePartsNo": getVal("sparePartsNo"),//备件料号
                    "ioType": getVal("ioType"),//出入库类型key（入库0   出库1），筛选条件
                    "dealStartTime": getVal("dealStartTime"),//处理开始时间，筛选条件
                    "dealEndTime": getVal("dealEndTime"),//处理结束时间，筛选条件
                },
            }, () => {
                this.onRefresh()
            })
        } else {
            this.getData()
        }

    }

    UNSAFE_componentWillReceiveProps(np) {
        if (this.props.index.done !== np.index.done) {
            this.resetData(np);
        }
    }


    componentDidMount() {
        this.resetData(this.props)
    }

    //下拉刷新,更改状态，重新获取数据
    onRefresh(draw) {
        this.setState({
            refreshing: true,
            isLoadMore: draw ? false : true
        }, () => {
            this.getData();
        });
    }

    //上拉加载
    pullUpLoading = () => {
        if (!this.state.isLoadMore && this.props.index.sparelog.hasNextPage) {
            this.setState({
                isLoadMore: true,
                postData: {
                    ...this.state.postData,
                    pageIndex: this.props.index.sparelog.pageNum + 1
                }
            }, () => {
                this.getData()
            })
        }
    }

    //返回顶部
    scrollToTop = () => {
        this._list && this._list.scrollTo({ x: 0, y: 0 }).then().catch();
    }

    changeData = (key, value) => {
        let { index: { formdata } } = this.props;
        let newformdata = formdata.map((item, i) => {
            if (item.key == key) {
                item.value = value
            } else {
            }
            return item
        })
        this.setNewState("formdata", newformdata)
    }


    render() {
        let { index: { res, formdata }, navigation, submitting } = this.props,
            { refreshing, search, postData, height, isLoadMore, showbtn } = this.state;

        let searchprops = {
            height,
            navigation,
            placeholder: "输入备件名称查询...",
            value: postData.sparePartsName,
            onChangeText: (val, ifs) => {
                this.setState({
                    postData: {
                        ...postData,
                        sparePartsName: val
                    }
                }, () => {
                    this.changeData("sparePartsName", val)
                    if (ifs) {
                        this.onRefresh()
                    }
                })
            },
            onSubmitEditing: () => {
                this.onRefresh()
            },
            handleFormData: (fn) => {
                let formdatas = [
                    {
                        key: "sparePartsName",
                        type: "input",
                        require: false,
                        value: postData.sparePartsName,
                        placeholder: "请输入备件名称"
                    }, {
                        key: "sparePartsNo",
                        type: "input",
                        require: false,
                        value: postData.sparePartsNo,
                        placeholder: "请输入备件料号"
                    }, {
                        key: "ioType",
                        type: "select",
                        require: false,
                        value: "",
                        placeholder: "请选择出入库类型",
                        option: [{
                            dicName: "入库",
                            dicKey: "0"
                        }, {
                            dicName: "出库",
                            dicKey: "1"
                        }
                        ]
                    }, {
                        key: "dealStartTime",
                        type: "datetimepicker",
                        mode: "date",
                        dateFormat: 'YYYY-MM-DD',
                        require: false,
                        linked: {
                            key: "dealEndTime",
                            option: "minimumDate",
                        },
                        value: "",
                        placeholder: "请选择开始处理时间"
                    },
                    {
                        key: "dealEndTime",
                        type: "datetimepicker",
                        mode: "date",
                        dateFormat: 'YYYY-MM-DD',
                        require: false,
                        value: "",
                        linked: {
                            key: "dealStartTime",
                            option: "maximumDate"
                        },
                        placeholder: "请选择处理结束时间"
                    },
                ]
                this.setNewState("formdata", formdata.length > 0 ? formdata : formdatas, () => {
                    fn ? fn() : null
                })
            }

        }

        let renderItem = ({ section: section, row: row }) => {
            let item = this.state.resData[section].items[row];
            return item ? <SpareLogItem item={ item } navigation={ this.props.navigation } type="history"></SpareLogItem> : <View></View>
        }

        return <SafeAreaViewPlus loading={ submitting && isLoadMore && refreshing }>
            <Header
                navigation={ navigation }
                title="出入库记录"
                rightwidth={ 70 }
                headerRight={ () => <Card height={ "100%" } enableShadow={ false } row center onPress={ () => {
                    let postData = JSON.parse(JSON.stringify(this.state.postData));
                    for (let i in postData) {
                        if (i == "pageIndex") {
                            postData[i] = 1
                        } else if (i == "pageSize") {
                            postData[i] = 10
                        } else {
                            postData[i] = ""
                        }
                    }
                    this.setState({
                        postData
                    }, () => {
                        this.onRefresh()
                    })
                    let { index: { formdata } } = this.props;
                    let newformdata = formdata.map((item, i) => {
                        item.value = null
                        if (item.type == 'datetimepicker') {
                            item.maximumDate = undefined
                            item.minimumDate = undefined
                            item.value = ""
                        }
                        return item
                    })
                    this.setNewState("formdata", newformdata)
                } }>
                    <AntIcons name="reload1" size={ 14 } />
                    <Text marginL-4>重置</Text>
                </Card> }
            >
            </Header>
            <View flex >
                <View style={ { padding: search ? 12 : 0, paddingBottom: 0 } }>
                    <TitleSearch { ...searchprops }></TitleSearch>
                </View>
                <LargeList
                    onScroll={ ({ nativeEvent: { contentOffset: { x, y } } }) => {
                        if (y > 400) {
                            if (showbtn) {
                            } else {
                                this.setState({
                                    showbtn: true
                                })
                            }
                        } else {
                            if (showbtn) {
                                this.setState({
                                    showbtn: false
                                })
                            } else {

                            }
                        }

                    } }
                    ref={ ref => (this._list = ref) }
                    onRefresh={ () => { this.onRefresh("0") } } //刷新操作
                    refreshHeader={ ChineseWithLastDateHeader }
                    showsVerticalScrollIndicator={ false }
                    style={ { padding: 0, marginTop: -3 } }
                    data={ this.state.resData }
                    renderIndexPath={ renderItem }//每行
                    heightForIndexPath={ () => 110 }
                    allLoaded={ !this.props.index.sparelog.hasNextPage }
                    loadingFooter={ ChineseWithLastDateFooter }
                    onLoading={ this.pullUpLoading }
                />
            </View>
            {
                showbtn && <ActionButton
                    size={ 38 }
                    hideShadow={ true }
                    bgColor={ "transparent" }
                    buttonColor={ colors.primaryColor }
                    offsetX={ 10 }
                    onPress={ this.scrollToTop }
                    renderIcon={ () => <AntIcons name='up' style={ { color: Colors.white } } size={ 16 } /> }
                />
            }


        </SafeAreaViewPlus>

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        paddingTop: 78,
        fontSize: 18,
        color: "#666"
    },
})
export default SpareLog