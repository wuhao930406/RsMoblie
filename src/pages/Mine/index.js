import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Card, Button } from 'react-native-ui-lib';
import { SafeAreaViewPlus, OneToast,Header } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';

@connect(({ index }) => ({ index }))
class Mine extends React.Component {

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
    this.setNewState("test", null)
  }


  render() {
    const { index } = this.props

    return <SafeAreaViewPlus>
      <Header title="我的">
      </Header>
      <View flex padding-page>
        <Text heading marginB-s4>Mine</Text>
        <Card height={100} center padding-card marginB-s4>
          <Text body>This is an Mine card {index.count}</Text>
        </Card>
        <Button label="Button" body bg-primaryColor square onPress={() => {
          this.login()
        }}></Button>
      </View>
    </SafeAreaViewPlus>

  }
}

export default Mine