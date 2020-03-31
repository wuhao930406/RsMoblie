import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, View, Text, Card, AnimatedImage, ThemeManager, BorderRadiuses, Checkbox } from 'react-native-ui-lib';
import AntIcons from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils';

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

class UserSelectItem extends Component {
  render() {
    let { item, navigation, avatar, device,selected,onValueChange } = this.props;
    let checkprops = {
      borderRadius: 60,
      value: selected.indexOf(item.id)!==-1,
      onValueChange: () => {
        onValueChange?onValueChange():null
      },
      color: colors.primaryColor
    }
    return <Card borderRadius={0} enableShadow={false} bg-white row
      style={{ alignItems: "center", borderBottomWidth: 1, borderColor: "#f9f9f9", height: 77 }}
      paddingL-12 paddingR-12
      onPress={() => {
        onValueChange?onValueChange():null
      }}
    >
      <Checkbox {...checkprops} style={{marginRight:12}}></Checkbox>
      <Avatar {...avatar}></Avatar>
      <View paddingL-12 spread flex-1>
        <Text dark20 body numberOfLines={1}>{item.userName}<Text body>{item.jobTitle ? `(${item.jobTitle})` : null}</Text></Text>
        <Text dark40 body marginT-4 numberOfLines={1}>{item.departmentName}</Text>
      </View>
      {
        device ? <View spread flex-1 right paddingR-12>
          <Text dark40 subbody numberOfLines={1}>{item.equipmentName}</Text>
          <Text dark40 subbody marginT-8 numberOfLines={1}>{item.equipmentNo}</Text>
        </View> : null
      }


    </Card>
  }
}





export default UserSelectItem
