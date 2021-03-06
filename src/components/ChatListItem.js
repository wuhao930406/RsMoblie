import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, View, Text, Card, AnimatedImage, ThemeManager, BorderRadiuses, Badge, Colors } from 'react-native-ui-lib';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { colors, ConvertPinyin } from '../utils';

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 12,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ThemeManager.dividerColor,
  },
});

function GetPinyin(name) {
  return ConvertPinyin(name).substring(0, 1).toUpperCase()
}

class ChatListItem extends Component {
  render() {
    let { item, navigation, type, hidden, children, reportItem, deleteItem } = this.props;
    let avatar = {
      title: 'Custom Background',
      label: item.commentUserName ? GetPinyin(item.commentUserName) : "",
      labelColor: Colors.white,
      backgroundColor: "#ddd",
      size: 30
    }

    return <Card borderRadius={0} enableShadow={false} bg-white
      style={{ borderBottomWidth: 1, borderColor: "#f9f9f9", height: type == "needreply" ? "auto" : 120 }}
      paddingL-12 paddingR-12
      onPress={() => {
        navigation.navigate("ChatDetail", item)
      }}
    >
      <View row paddingV-12>
        <View paddingT-6>
          <Avatar {...avatar}></Avatar>
        </View>
        <View paddingL-12 flex-1>
          <TouchableWithoutFeedback onPress={() => {
            reportItem && reportItem(true)
          }}>
            <View>
              <View spread>
                <Text dark20 subbody numberOfLines={1}>
                  {item.commentUserName}
                  <Text subbody>{item.commentUserTitle ? `(${item.commentUserTitle})` : null}</Text>
                </Text>
                <Text dark40 subbody marginT-4 numberOfLines={1}>{item.commentUserDepartmentName}</Text>
              </View>
              <View row left top paddingV-8 style={{ alignItems: "center" }}>
                {
                  type == "needreply" ? <Text subbody>
                    回复
                      <Text blue20>
                      {item.replyedUserName}
                    </Text>：
                    {item.comment && item.comment.replace(/\n/g, "")}
                  </Text> : <Text subbody numberOfLines={1}>
                      {item.comment && item.comment.replace(/\n/g, "")}
                    </Text>
                }

              </View>
            </View>
          </TouchableWithoutFeedback>


          <View row spread top paddingV-0 style={{ alignItems: "center" }}>
            <View spread row>
              <View flex-1 left>
                <Text subbody numberOfLines={1}>{item.commentTime}</Text>
              </View>
              <View flex-1 row right style={{ alignItems: "center" }}>
                <TouchableWithoutFeedback onPress={() => {
                  reportItem && reportItem()
                }}>
                  <View row style={{ alignItems: "center" }}>
                    <AntIcons name='message1'></AntIcons>
                    <Text marginL-6 subbody numberOfLines={1}>{item.childrenCount ? item.childrenCount : "回复"}</Text>
                  </View>
                </TouchableWithoutFeedback>
                {
                  item.isMine && <TouchableWithoutFeedback onPress={() => {
                    deleteItem && deleteItem()
                  }}>
                    <View marginL-12>
                      <AntIcons name="delete" size={16} color="red"></AntIcons>
                    </View>
                  </TouchableWithoutFeedback>
                }

              </View>
            </View>
          </View>
        </View>

      </View>




    </Card>
  }
}





export default ChatListItem
