import React from "react";
import { StyleSheet, Linking, TouchableOpacity } from "react-native";
import { LargeList } from "react-native-largelist-v3";
import { SafeAreaViewPlus, HideToast, OpenToast, Header, Atoz, TitleSearch } from '../../../components';
import { ConvertPinyin } from '../../../utils';
import { contacts } from './mock';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, Colors, Avatar, Card } from "react-native-ui-lib";


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  section: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

});

let getPinyin = () => {
  var ch_big = 'A';
  var str_big = [];
  for (var i = 0; i < 26; i++) {
    str_big.push(String.fromCharCode(ch_big.charCodeAt(0) + i))
    if (i == 25) {
      str_big.push("#")
    }
  }
  return str_big;
}


@connect(({ index }) => ({ index }))
class UserList extends React.Component {
  _scrollView = null;
  constructor(props) {
    super(props);
    this.state = {
      pinyin: [],
      isSpin: true,
      cur: "A",
      contacts: contacts,
      keyword: "",
      postUrl: "userlist",
      postData: {
        "accountName": "",   //---------用户名
        "departmentId": "",   //--------部门id
        "groupId": "",    //-------分组id
        "jobTitle": "",   //--------职责
        "parentName": "",   //-------直属领导姓名
        "shopId": "",   //-------车间id
        "userName": ""  //--------姓名
      }
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


  componentDidMount() {
    this.genData()
  }
  //获取数据整理格式
  genData() {
    this.setState({
      isSpin: true
    })
    let { postData, postUrl } = this.state;
    console.log(postData)
    this.setNewState(postUrl, postData, () => {
      let newdata = [],
        res = this.props.index.userlist,
        postdata = res.map((item, i) => {
          item.header = ConvertPinyin(item.userName).substring(0, 1).toUpperCase();
          return item
        }),
        letterarr = getPinyin();
      letterarr.map((item, i) => {
        let items = [], itemz = [];
        postdata.map((list, index) => {
          if (item == list.header) {
            items.push(list)
          } else if (letterarr.indexOf(list.header) == -1) {
            itemz.push(list)
          }
        })
        let curitem = {
          header: item,
          items: item == "#" ? itemz : items
        }
        curitem.items.length == 0 ? null : newdata.push(curitem);
      })
      this.setState({
        contacts: newdata,
        pinyin: newdata.map((item) => {
          return item.header
        }),
        isSpin: false
      })
    })
  }

  //拨打电话
  linking(url) {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {

      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));

  }


  _renderSection = (section) => {
    return (
      <View row spread style={styles.section}>
        <Text style={{ paddingLeft: 24 }}>
          {this.state.contacts[section].header}
        </Text>

      </View>
    );
  };

  _renderIndexPath = ({ section: section, row: row }) => {
    let item = this.state.contacts[section].items[row],
      avatar = {
        title: 'Initials with Color',
        imageSource: require("../../../assets/user.png"),
      }
    return (
      <Card borderRadius={0} enableShadow={false} bg-white row
        style={{ alignItems: "center", borderBottomWidth: 1, borderColor: "#f9f9f9" }}
        paddingL-page paddingR-page
        onPress={() => {
          //OpenToast(0)
        }}
      >
        <Avatar {...avatar}></Avatar>
        <View paddingL-12 spread>
          <Text dark20 subheading>{item.userName}</Text>
          <Text body marginT-4>{item.departmentName}</Text>
        </View>
      </Card>
    );
  };

  changetodo = (index) => {
    var zm = getPinyin();
    this._scrollView.scrollToIndexPath({ section: index, row: 0 }, false);
  }



  render() {
    let { cur, contacts, isSpin, postData, pinyin } = this.state,
      { navigation } = this.props,
      searchprops = {
        height: 45,
        navigation,
        placeholder: "输入姓名查询...",
        value: postData.accountName,
        onChangeText: (val) => {
          this.setState({
            postData: {
              ...postData,
              accountName: val
            }
          })
        },
        onSubmitEditing: () => {
          this.genData()
        }
      }




    return (
      <SafeAreaViewPlus>
        <Header title="用户列表">
        </Header>
        <View padding-12 style={{paddingBottom:0}}>
          <TitleSearch {...searchprops}></TitleSearch>
        </View>
        <View style={{ position: "relative", flex: 1,marginTop:-3 }} row center>
          <LargeList
            ref={ref => (this._scrollView = ref)}
            style={styles.container}
            data={contacts}
            heightForSection={() => 30}
            renderSection={this._renderSection}
            heightForIndexPath={() => 77}
            renderIndexPath={this._renderIndexPath}
            renderHeader={null}
            renderFooter={null}
          />
          {
            pinyin.length > 0 && <Atoz changetodo={this.changetodo} pinyin={pinyin}>
            </Atoz>
          }



        </View>
      </SafeAreaViewPlus>
    );
  }
}
export default UserList

